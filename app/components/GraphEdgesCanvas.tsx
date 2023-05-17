import { useContext, useEffect, useRef } from "react";
import ElementPositionContext from "~/contexts/ElementPositionContext";

interface GraphEdgeProps {
  width: number;
  height: number;
  // edgeData: {
  //   source: string;
  //   target: string;
  //   value: number;
  // };
}

// const GraphNode = ({ edgeData }: GraphEdgeProps) => {
const GraphEdgesCanvas = ({ width, height }: GraphEdgeProps) => {
  const positioningData = useContext(ElementPositionContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawLine = (
    context: CanvasRenderingContext2D,
    startCoord: number[],
    endCoord: number[]
  ) => {
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(startCoord[0], startCoord[1]);
    context.lineTo(endCoord[0], endCoord[1]);
    context.stroke();
    context.closePath();
  };

  useEffect(() => {
    if (
      positioningData === null ||
      positioningData?.nodes?.length === 0 ||
      positioningData?.links?.length === 0
    ) {
      return;
    }

    const canvas = canvasRef.current;

    const context = canvas && canvas.getContext("2d");
    if (!context) {
      debugger;
      return;
    }

    positioningData.links.forEach((link) => {
      const startNode = positioningData.nodes.find(
        (node) => node.id === link.source
      );
      const endNode = positioningData.nodes.find(
        (node) => node.id === link.target
      );
      if (
        startNode &&
        endNode &&
        startNode.centerCoordinates &&
        endNode.centerCoordinates
      ) {
        drawLine(
          context,
          startNode.centerCoordinates,
          endNode.centerCoordinates
        );
      }
    });

    //Our first draw
    // context.fillStyle = "#000000";
    // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }, [positioningData]);

  return (
    <>
      {width && height && (
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      )}
    </>
  );
};
export default GraphEdgesCanvas;
