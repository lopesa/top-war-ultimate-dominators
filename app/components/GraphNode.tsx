import { useContext, useEffect, useState } from "react";
import ElementPositionContext from "~/contexts/ElementPositionContext";
import { INITIAL_NODE_DIAMETER } from "~/Constants";

interface GraphNodeProps {
  id: string;
}

const GraphNode = ({ id }: GraphNodeProps) => {
  const positioningData = useContext(ElementPositionContext);
  const [coordinates, setCoordinates] = useState<number[]>([0, 0]);

  useEffect(() => {
    if (positioningData !== null && positioningData?.nodes?.length > 0) {
      const node = positioningData.nodes.find((node) => node.id === id);
      if (node && node.centerCoordinates) {
        setCoordinates(node.centerCoordinates);
      }
    }
  }, [positioningData, id]);

  return (
    <div
      style={{
        width: `${INITIAL_NODE_DIAMETER}px`,
        height: `${INITIAL_NODE_DIAMETER}px`,
        backgroundColor: "red",
        borderRadius: "50%",
        position: "absolute",
        left: `${coordinates[0] - INITIAL_NODE_DIAMETER / 2}px`,
        top: `${coordinates[1] - INITIAL_NODE_DIAMETER / 2}px`,
      }}
    >
      {id}
    </div>
  );
};
export default GraphNode;
