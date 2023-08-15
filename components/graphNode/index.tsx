import React, { FunctionComponent } from 'react';
import { Node, NodeProps, Position, HandleType } from 'reactflow';

import greenPolygon from '../../assets/managementIcon.svg';
import pinkClusterIcon from '../../assets/cluster.svg';
import unavailableClusterSrc from '../../assets/cluster-unavailable.svg';
import { BLUE_REFLECTION, MAGIC_MINT, SASSY_PINK } from '../../constants/colors';
import { CLUSTER_TAG_CONFIG } from '../../constants';
import { ClusterStatus, ClusterType } from '../../types/provision';
import { ClusterInfo } from '../clusterTable/clusterTable';

import {
  Container,
  Img,
  Label,
  LabelContainer,
  MainContainerInfo,
  NodeHandle,
  NodeLabel,
  NodeLabelContainer,
  OtherContainerInfo,
  Region,
  StyledTag,
} from './graphNode.styled';

const GRAPH_NODE_CONFIG: Record<
  ClusterType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { handle: HandleType; position: Position; imageSrc: any; nodeColor: string }
> = {
  [ClusterType.DRAFT]: {
    handle: 'target',
    position: Position.Left,
    imageSrc: unavailableClusterSrc,
    nodeColor: BLUE_REFLECTION,
  },
  [ClusterType.MANAGEMENT]: {
    handle: 'source',
    position: Position.Right,
    imageSrc: greenPolygon,
    nodeColor: MAGIC_MINT,
  },
  [ClusterType.WORKLOAD]: {
    handle: 'target',
    position: Position.Left,
    imageSrc: pinkClusterIcon,
    nodeColor: SASSY_PINK,
  },
};

export type CustomGraphNode = Node<ClusterInfo, 'custom'>;

export const GraphNode: FunctionComponent<NodeProps<ClusterInfo>> = ({ data, isConnectable }) => {
  const { status, type, clusterName, cloudProvider, cloudRegion, nodes } = data;

  const { iconLabel, iconType, bgColor } = CLUSTER_TAG_CONFIG[status ?? ClusterStatus.ERROR];
  const { handle, position, imageSrc, nodeColor } = GRAPH_NODE_CONFIG[type];

  return (
    <Container borderColor={nodeColor}>
      <MainContainerInfo>
        <NodeLabel>{clusterName}</NodeLabel>
        <LabelContainer>
          <Label>CLOUD:</Label>
          {cloudProvider && <p>{cloudProvider}</p>}
        </LabelContainer>
        <LabelContainer>
          <Label>REGION:</Label>
          {cloudRegion && <Region>{cloudRegion}</Region>}
        </LabelContainer>
      </MainContainerInfo>
      <OtherContainerInfo>
        {status && <StyledTag text={iconLabel} bgColor={bgColor} icon={iconType} />}
        <NodeLabelContainer>
          <Label>NODE COUNT:</Label>
          {nodes && <p>{nodes}</p>}
        </NodeLabelContainer>
      </OtherContainerInfo>
      <NodeHandle
        type={handle}
        position={position}
        isConnectable={isConnectable}
        bgColor={nodeColor}
      />
      <Img src={imageSrc} alt={`cluster ${type} node`} />
    </Container>
  );
};