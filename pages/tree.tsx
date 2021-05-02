import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import styles from './tree.module.css'
import { TREE_DATA } from './tree.data';

import { Tree as TreeClass, TreeData } from '../lib/tree';

// @refresh reset
const customRenderFunction = (nodeElement: HTMLElement, nodeData: {name: string}, cb: () => void) => {
  return ReactDOM.render(React.createElement(Tile, nodeData, 'innerHTML'), nodeElement, cb);
}

export default function Home() {
  const ref = useRef();

  useEffect(() => {
    const treeObject = new TreeClass<{name: string}>(ref.current, TREE_DATA)
    treeObject.setRenderFunction(customRenderFunction);
    treeObject.render();
  })

  return (<div style={{display: 'flex', justifyContent: 'center'}}>
      {/* <Tree nodeData={TREE_DATA} /> */}

      <div ref={ref}>
      </div>
    </div>
    );
}

const Tree = ({ nodeData, ...props }) => {
  return (
    <div className={styles.subtree}>
      <Tile data={nodeData.data} />
      <div style={{ display: 'flex', position: 'relative' }}>
        {nodeData.children &&
          nodeData.children.map((childNodeData, i) => <Tree nodeData={childNodeData} key={i} />)}
      </div>
    </div>
  );
};

const Tile = (data) => {
  if (!data) {
    return (<div>empty</div>)
  }
  return (
    <div
      key={1}
      style={{
        padding: '16px',
        border: '1px solid black',
        textAlign: 'center',
        margin: '24px',
      }}
    >
      {data.name}
    </div>
  );
};
