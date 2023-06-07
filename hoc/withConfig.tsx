import React, { FunctionComponent, useEffect } from 'react';
import { PostHog } from 'posthog-node';
import { setConfigValues } from 'redux/slices/config.slice';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { setFeatureFlags } from '../redux/slices/featureFlags.slice';

export interface PageProps {
  disableTelemetry?: boolean;
  flags?: { [key: string]: boolean };
  isClusterZero: boolean;
  kubefirstVersion?: string;
}

export async function getServerSideProps() {
  const {
    DISABLE_TELEMETRY = '',
    IS_CLUSTER_ZERO = '',
    KUBEFIRST_VERSION = '',
    POSTHOG_KEY = '',
  } = process.env;

  let flags;
  try {
    const client = new PostHog(POSTHOG_KEY || 'phc_N4K5yJQsiIDBRK3X6rfrZlldK5uf2u1vgvlB82RADKn');
    flags = await client.getAllFlags('');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('An error occurred while getting feature flags', error);
    flags = [];
  }

  return {
    props: {
      flags,
      disableTelemetry: DISABLE_TELEMETRY === 'true',
      isClusterZero: IS_CLUSTER_ZERO === 'true',
      kubefirstVersion: KUBEFIRST_VERSION,
    },
  };
}

export default function withConfig(WrappedComponent: FunctionComponent<PageProps>) {
  const Component = ({ disableTelemetry, flags, isClusterZero, kubefirstVersion }: PageProps) => {
    const dispatch = useAppDispatch();
    const flagsHaveLoaded = useAppSelector(({ featureFlags }) => featureFlags.loaded);

    useEffect(() => {
      dispatch(setFeatureFlags(flags));
      dispatch(
        setConfigValues({
          isTelemetryDisabled: !!disableTelemetry,
          kubefirstVersion,
          isClusterZero,
        }),
      );
    }, [dispatch, disableTelemetry, kubefirstVersion, flags, isClusterZero]);

    return flagsHaveLoaded ? <WrappedComponent isClusterZero={isClusterZero} /> : null;
  };

  return Component;
}