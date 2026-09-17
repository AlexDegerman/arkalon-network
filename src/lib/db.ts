import 'server-only'
import { Pool, PoolConfig } from 'pg'

function getPoolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    return {
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false
    }
  }

  let searchPath: string | null = null
  try {
    const url = new URL(connectionString)
    searchPath = url.searchParams.get('search_path')
  } catch {
    // If not a valid URL, ignore
  }

  return {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    options: searchPath ? `-c search_path=${searchPath},public` : undefined
  }
}

const pool = new Pool(getPoolConfig())

// Ensure search_path is set when a client connection opens
const connStr = process.env.DATABASE_URL
if (connStr) {
  try {
    const url = new URL(connStr)
    const searchPath = url.searchParams.get('search_path')
    if (searchPath) {
      pool.on('connect', (client) => {
        client.query(`SET search_path TO "${searchPath}", public`)
      })
    }
  } catch {
    // ignore
  }
}

export default pool
