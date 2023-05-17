import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
// import * as d3 from "d3"
import { useEffect, useRef } from 'react';
import ForceGraph from "~/components/d3_ForceGraph"

// import { useOptionalUser } from "~/utils";

type D3FormattedData = {
  nodes: {id: string}[],
  links: {source: string, target: string, value: number}[]
}

export const meta: V2_MetaFunction = () => [{ title: "Top War Ultimate Dominators" }];

const spreadsheetUrl = "https://docs.google.com/spreadsheets/d/15PqlUgPb9h5gfiT-3JVImW89cJZwegAbnB5KIe2TGW0/gviz/tq?tq=select%20*&tqx=out:csv"

export const loader = async () => {
  let d3FormattedData: D3FormattedData = {
    nodes: [],
    links: []
  } 

  const response = await fetch(spreadsheetUrl)
  const csvAsText = await response.text()
  const csvAsArrays: string[][] = csvAsText.split('\n').map(row => {
    return row.split(',').filter(item => item !== '""').map(item => {
      return item.replace(/\D+/g, '')
    })
  })

  csvAsArrays.forEach(node => {
    d3FormattedData.nodes.push({
      id: node[0]
    })
    for (let i = 1; i < node.length; i++) {
      d3FormattedData.links.push({
        source: node[0],
        target: node[i],
        value: 1
      })
    }
  })
  
  return json(d3FormattedData)
  // return json(csvAsArrays)

  // const response = await fetch("https://api.github.com/gists");
  // return json(await response.text())
  // if (response?.ok) {
  //   replyJson = await response.json()
  // }
  // debugger;
  // return json;
  // return json({
  //   data: replyJson
  // })

  // debugger;
  // return json({
  //   data: spreadsheetData
  // })
}

export default function Index() {
  // const d3Ref = useRef<SVGSVGElement>(null);
  const d3Ref = useRef<HTMLDivElement>(null);
  // const data = useLoaderData<typeof loader>();
  const data = useLoaderData<D3FormattedData>();
  debugger;
  // const graph = ForceGraph(data)
  // debugger;
  
  // const graph = null
  
  useEffect(()=> {
      if (!d3Ref) {
        return
      }
      if (d3Ref.current?.children.length) {
        return
      }
      debugger;
      const graph = ForceGraph(data)
      // const graph = ForceGraph(data, {
      //   nodeId: d => d.id,
      //   nodeTitle: d => d.id,
      //   linkStrokeWidth: l => Math.sqrt(l.value),
      //   width,
      //   height: 600,
      //   invalidation // a promise to stop the simulation when the cell is re-run
      // })
      //@ts-ignore

      d3Ref.current?.appendChild(graph)
      debugger;
  }, [d3Ref, data])

  // debugger;

  return (
    <main>
      {/* <h1>Hello Top War</h1> */}
      <div ref={d3Ref}></div>
    </main>
  );
}
