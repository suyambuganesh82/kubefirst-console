import React, { ForwardedRef, FunctionComponent, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import AutocompleteMUI, { autocompleteClasses } from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { SxProps } from '@mui/system';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { InputLabel } from '@mui/material';

import TextField from '../TextField/TextField';
import Column from '../Column/Column';
import Typography from '../Typography/Typography';
import { Required } from '../TextField/TextField.styled';
import Row from '../Row/Row';
import Tag from '../Tag/Tag';

import { AutoTextField, InputAdornmentContainer, Label, MenuItem } from './Autocomplete.styled';

import { ClusterEnvironment } from '@/types/provision';
import { noop } from '@/utils/noop';
import { ROYAL_PURPLE } from '@/constants/colors';

const NEW_ENV: ClusterEnvironment = {
  id: 'create env',
  name: 'create env',
  color: 'cyan',
  creationDate: 'now',
};

export interface IAutocompleteProps extends ControllerRenderProps<FieldValues> {
  label: string;
  inputRef?: ForwardedRef<unknown>;
  loading?: boolean;
  noOptionsText?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  sx?: SxProps;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOptions?: (options: any[]) => any[];
  onClick?: () => void;
}

const AutocompleteComponent: FunctionComponent<IAutocompleteProps> = ({
  label,
  loading,
  noOptionsText,
  placeholder,
  options,
  required,
  error,
  sx,
  filterOptions,
  disabled,
  onClick,
  ...props
}) => {
  // Unfortunately MaterialUI doesn't not update the dom state when no options are available
  const value = useMemo(() => (options.length ? props.value : ''), [options.length, props.value]);

  return (
    <AutocompleteMUI
      loading={loading}
      fullWidth
      options={options}
      popupIcon={<SearchIcon />}
      noOptionsText={noOptionsText}
      filterOptions={filterOptions}
      sx={{ ...sx, [`& .${autocompleteClasses.popupIndicator}`]: { transform: 'none' } }}
      disabled={disabled}
      ListboxProps={{
        style: {
          maxHeight: '210px',
        },
      }}
      {...props}
      isOptionEqualToValue={(option: string, value: string) => option === value}
      renderInput={(params) => (
        <TextField
          {...params}
          ref={params.InputProps.ref}
          required={required}
          placeholder={placeholder}
          error={error}
          endAdornment={
            <InputAdornmentContainer position="end">
              {loading ? (
                <CircularProgress color="inherit" size={14} />
              ) : (
                params.InputProps.endAdornment
              )}
            </InputAdornmentContainer>
          }
          value={value}
          label={label}
          onClick={onClick}
        />
      )}
    />
  );
};

export interface AutocompleteTagsProps
  extends Omit<IAutocompleteProps, 'options' | 'filterOptions'> {
  options: ClusterEnvironment[];
  onTagDelete: () => void;
  onChange: (value?: ClusterEnvironment) => void;
  createEnvironment?: boolean;
  onAddNewEnvironment?: () => void;
}

const AutocompleteTagsComponent: FunctionComponent<AutocompleteTagsProps> = ({
  options,
  value,
  onChange,
  onTagDelete,
  onAddNewEnvironment = noop,
  required,
  disabled,
  createEnvironment,
  label,
}) => {
  return (
    <AutocompleteMUI
      multiple
      fullWidth
      options={createEnvironment ? [NEW_ENV, ...options] : options}
      value={value ? (value.name !== NEW_ENV.name ? [value] : []) : []}
      getOptionLabel={(option) => option.name}
      onChange={(_, options) => {
        const [option] = options.reverse();
        onChange(option?.name !== NEW_ENV.name ? option : undefined);
      }}
      isOptionEqualToValue={(option: ClusterEnvironment) => {
        return option.name === value?.name;
      }}
      popupIcon={<KeyboardArrowDownIcon />}
      ListboxProps={{
        style: {
          maxHeight: '210px',
        },
      }}
      renderInput={(params) => (
        <Column style={{ gap: '4px' }}>
          <InputLabel disabled={disabled}>
            <Label variant="labelLarge">
              {label} {required && <Required>*</Required>}
            </Label>
          </InputLabel>
          <AutoTextField {...params} hiddenLabel size="small" />
        </Column>
      )}
      renderOption={({ onClick = noop, ...rest }, option) => {
        const createNewEnvironment = option.name === NEW_ENV.name;
        return (
          <MenuItem
            {...rest}
            disableRipple
            onClick={(e) => {
              if (createNewEnvironment) {
                onAddNewEnvironment();
              }
              onClick(e);
            }}
          >
            {createNewEnvironment ? (
              <Row style={{ gap: '4px', alignItems: 'center' }}>
                <AddIcon sx={{ height: 20, width: 20, color: ROYAL_PURPLE }} />
                <Typography variant="body3" sx={{ color: ROYAL_PURPLE }}>
                  New environment
                </Typography>
              </Row>
            ) : (
              <Tag text={option.name} bgColor={option.color} />
            )}
          </MenuItem>
        );
      }}
      renderTags={(tags) =>
        tags.map((option, index) => (
          <Tag
            key={index}
            removable
            text={option.name}
            bgColor={option.color}
            onDelete={onTagDelete}
          />
        ))
      }
    />
  );
};

const Autocomplete = React.forwardRef<unknown, IAutocompleteProps>((props, ref) => {
  return <AutocompleteComponent inputRef={ref} {...props} />;
});

export const AutocompleteTags = React.forwardRef<unknown, AutocompleteTagsProps>((props, ref) => {
  return <AutocompleteTagsComponent inputRef={ref} {...props} />;
});

export default Autocomplete;
