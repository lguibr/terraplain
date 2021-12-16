import * as fs from 'fs'
import * as path from 'path'

export default function getPath(pathString?: string) {
  const resolvedPath = path.resolve(pathString || '.')
  const realPath = fs.realpathSync.native(resolvedPath)
  return realPath
}