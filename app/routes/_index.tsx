import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
// import * as d3 from "d3"
import { createContext, useEffect, useRef } from "react";
// import ForceGraph from "~/components/d3_ForceGraph"
import useWindowSize from "~/hooks/useWindowSize";
import { ElementPositionContextProvider } from "~/contexts/ElementPositionContext";
import GraphNode from "~/components/GraphNode";
import {
  INITIAL_NODE_DIAMETER,
  NODE_DISTANCE_MULTIPLIER,
  INITIAL_LINK_WIDTH,
  CENTER_NODE_ID,
} from "~/Constants";
import GraphEdgesCanvas from "~/components/GraphEdgesCanvas";

type D3FormattedData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};
export interface LayoutFormattedData {
  nodes: { id: string; centerCoordinates?: number[] }[];
  links: { source: string; target: string; value: number }[];
}

export const meta: V2_MetaFunction = () => [
  { title: "Top War Ultimate Dominators" },
];

const spreadsheetUrl =
  "https://docs.google.com/spreadsheets/d/15PqlUgPb9h5gfiT-3JVImW89cJZwegAbnB5KIe2TGW0/gviz/tq?tq=select%20*&tqx=out:csv";

export const loader = async () => {
  let d3FormattedData: D3FormattedData = {
    nodes: [],
    links: [],
  };

  const response = await fetch(spreadsheetUrl);
  const csvAsText = await response.text();
  const csvAsArrays: string[][] = csvAsText.split("\n").map((row) => {
    return row
      .split(",")
      .filter((item) => item !== '""')
      .map((item) => {
        return item.replace(/\D+/g, "");
      });
  });

  csvAsArrays.forEach((node) => {
    d3FormattedData.nodes.push({
      id: node[0],
    });
    for (let i = 1; i < node.length; i++) {
      d3FormattedData.links.push({
        source: node[0],
        target: node[i],
        value: 1,
      });
    }
  });
  return json(d3FormattedData);
};

export default function Index() {
  const windowSize = useWindowSize();
  const data = useLoaderData<D3FormattedData>();
  let layoutData: LayoutFormattedData = {
    nodes: structuredClone(data.nodes),
    links: structuredClone(data.links),
  };
  const screenCenter = [
    Math.floor(windowSize.innerWidth / 2),
    Math.floor(windowSize.innerHeight / 2),
  ];
  const centerNodeIndex = layoutData.nodes.findIndex(
    (node) => node.id === CENTER_NODE_ID
  );
  layoutData.nodes[centerNodeIndex].centerCoordinates = screenCenter;
  let linkedNodes = data.links.reduce((acc, cur) => {
    if (cur.source === CENTER_NODE_ID) {
      acc.push(cur.target);
    }
    return acc;
  }, [] as string[]);

  if (linkedNodes.length !== 4) {
    return;
  }

  layoutData.nodes.find(
    (node) => node.id === linkedNodes[0]
  )!.centerCoordinates = [
    screenCenter[0],
    screenCenter[1] + NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
  ];

  layoutData.nodes.find(
    (node) => node.id === linkedNodes[1]
  )!.centerCoordinates = [
    screenCenter[0] + NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
    screenCenter[1],
  ];

  layoutData.nodes.find(
    (node) => node.id === linkedNodes[2]
  )!.centerCoordinates = [
    screenCenter[0],
    screenCenter[1] - NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
  ];

  layoutData.nodes.find(
    (node) => node.id === linkedNodes[3]
  )!.centerCoordinates = [
    screenCenter[0] - NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
    screenCenter[1],
  ];

  return (
    <ElementPositionContextProvider value={layoutData}>
      <main style={{ position: "relative", width: "100%", height: "100%" }}>
        {layoutData.links && (
          <GraphEdgesCanvas
            width={windowSize.innerWidth}
            height={windowSize.innerHeight}
          />
        )}
        {layoutData.nodes &&
          layoutData.nodes.map((node) => {
            return <GraphNode key={node.id} id={node.id} />;
          })}
      </main>
    </ElementPositionContextProvider>
  );
}
