import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
// import * as d3 from "d3"
import { createContext, useEffect, useRef, useState } from "react";
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
import { link } from "fs";

type D3FormattedData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

type GraphNodeType = {
  id: string;
  centerCoordinates?: number[];
};
export interface LayoutFormattedData {
  nodes: GraphNodeType[];
  links: { source: string; target: string; value: number; drawn?: boolean }[];
}

export const meta: V2_MetaFunction = () => [
  { title: "Top War Ultimate Dominators" },
];

// const spreadsheetUrl =
//   "https://docs.google.com/spreadsheets/d/15PqlUgPb9h5gfiT-3JVImW89cJZwegAbnB5KIe2TGW0/gviz/tq?tq=select%20*&tqx=out:csv";

const spreadsheetUrl =
  "https://docs.google.com/spreadsheets/d/16eEuq3b7Jlp7kSavEMY4a6voGtaEfTGOhXW-svkxSPw/gviz/tq?tq=select%20*&tqx=out:csv";

const pyUrl = "http://localhost:5000/visualize";

export const loader = async () => {
  let layoutFormattedData: LayoutFormattedData = {
    nodes: [],
    links: [],
  };

  const response = await fetch(spreadsheetUrl);
  const responseBlob = await response.blob();

  const pyResponse = await fetch(pyUrl, {
    method: "POST",
    body: responseBlob,
  });

  // const csvAsBlob = await pyResponse.blob();
  const csvAsJson = await pyResponse.json();
  // const csvAsText = await pyResponse.text();

  // const image = await pyResponse.blob();

  // const csvAsText = await response.text();
  // const csvAsArrays: string[][] = csvAsText.split("\n").map((row) => {
  //   return row
  //     .split(",")
  //     .filter((item) => item !== '""')
  //     .map((item) => {
  //       return item.replace(/\D+/g, "");
  //     });
  // });

  // csvAsArrays.forEach((node) => {
  //   layoutFormattedData.nodes.push({
  //     id: node[0],
  //   });
  //   for (let i = 1; i < node.length; i++) {
  //     layoutFormattedData.links.push({
  //       source: node[0],
  //       target: node[i],
  //       value: 1,
  //     });
  //   }
  // });

  // const centerNode = layoutFormattedData.nodes.find((node) => {
  //   return node.id === CENTER_NODE_ID;
  // });

  // if (!centerNode) {
  //   return new Error("No center node found");
  // }

  // return json(layoutFormattedData);
  return json(csvAsJson);
};

const setDataForNode = (
  node: GraphNodeType,
  layoutData: LayoutFormattedData,
  coordinates?: number[]
) => {
  // debugger;
  if (coordinates) {
    node.centerCoordinates = coordinates;
  }

  let linkedNodeIds = layoutData.links.reduce((acc, cur) => {
    if (cur.source === node.id) {
      acc.push(cur.target);
    }
    return acc;
  }, [] as string[]);

  layoutData.links.map((link) => {
    if (link.source === node.id && linkedNodeIds.includes(link.target)) {
      link.drawn = true;
    }
    return link;
  });

  // debugger;

  const baseCoordinates = node.centerCoordinates;

  if (linkedNodeIds.length === 0 || !baseCoordinates) {
    return;
  }

  let upNode = layoutData.nodes.find((node) => node.id === linkedNodeIds[0]);
  if (upNode && !upNode?.centerCoordinates) {
    upNode.centerCoordinates = [
      baseCoordinates[0],
      baseCoordinates[1] + NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
    ];
  }

  let rightNode = layoutData.nodes.find((node) => node.id === linkedNodeIds[1]);
  if (rightNode && !rightNode?.centerCoordinates) {
    rightNode.centerCoordinates = [
      baseCoordinates[0] + NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
      baseCoordinates[1],
    ];
  }

  let downNode = layoutData.nodes.find((node) => node.id === linkedNodeIds[2]);
  if (downNode && !downNode?.centerCoordinates) {
    downNode.centerCoordinates = [
      baseCoordinates[0],
      baseCoordinates[1] - NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
    ];
  }

  let leftNode = layoutData.nodes.find((node) => node.id === linkedNodeIds[3]);
  if (leftNode && !leftNode?.centerCoordinates) {
    leftNode.centerCoordinates = [
      baseCoordinates[0] - NODE_DISTANCE_MULTIPLIER * INITIAL_NODE_DIAMETER,
      baseCoordinates[1],
    ];
  }

  // let undrawn = layoutData.links.filter((link) => {
  //   return !link.drawn;
  // });

  // debugger;

  // if (undrawn.length > 0) {
  let linkedNodes = [upNode, rightNode, downNode, leftNode];
  // debugger;
  // for (let i = 0; i < linkedNodes.length; i++) {
  //   if (typeof linkedNodes[i] !== "undefined") {
  //     setDataForNode(linkedNodes[i] as GraphNodeType, layoutData);
  //   }
  // }
  //   // linkedNodes.forEach((node) => {
  //   //   debugger;
  //   //   if (node) {
  //   //     setDataForNode(node, layoutData);
  //   //   }
  //   // });
  // }
};

export default function Index() {
  const windowSize = useWindowSize();
  const data = useLoaderData<D3FormattedData>();
  debugger;
  let layoutData: LayoutFormattedData = {
    nodes: structuredClone(data.nodes),
    links: structuredClone(data.links),
  };
  // let layoutData: LayoutFormattedData = {
  //   nodes: structuredClone(data.nodes),
  //   links: structuredClone(data.links),
  // };
  const screenCenter = [
    Math.floor(windowSize.innerWidth / 2),
    Math.floor(windowSize.innerHeight / 2),
  ];
  // const centerNode = layoutData.nodes.find((node) => {
  //   return node.id === CENTER_NODE_ID;
  // });
  // if (!centerNode) {
  //   return;
  // }
  // debugger;
  // setDataForNode(centerNode, layoutData, screenCenter);

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
