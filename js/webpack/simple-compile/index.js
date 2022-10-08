import fs from 'fs'
import path from 'path'

import parser from '@babel/parser'
import traverse from '@babel/traverse'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'
import { assert } from 'console'

let id = 1;
function createAsset(filePath) {

  // 1. 获取文件的内容
  // ast 获取代码的信息
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  // console.log(source);

  // 2. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: 'module'
  })
  // console.log(`ast`, ast);
  const deps = [];
  // console.log(`traverse`, traverse.default);
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      // console.log('import');
      // console.log(node.source.value);
      deps.push(node.source.value)
    }
  })
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  // console.log(`code`, code);

  return {
    id: id++,
    mapping: {},
    filePath,
    source,
    code,
    deps
  }
}
// const res = createAsset()
// console.log(`res`, res);
function createGraph() {
  const mainAsset = createAsset('./example/main.js')
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = child.id;
      queue.push(child);
      // console.log(`child`, child);
    })

  }
  return queue
}
const graph = createGraph()
function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', 'utf-8');


  const data = graph.map((asset) => {
    const { id, mapping, code } = asset;
    return {
      id,
      mapping,
      code,
    }
  })
  // console.log(`data`, data);
  const code = ejs.render(template, { data });

  fs.writeFileSync('./dist/bundle.js', code);
  // console.log(`code`, code);
}



build(graph)