import { createBirpc } from 'birpc'
import { useEffect, useRef } from 'react'
import type { BirpcOptions, BirpcReturn } from 'birpc'

export function useRPC<
  RemoteFunctions extends object = Record<string, never>,
  LocalFunctions extends object = Record<string, never>,
>(
  localFunctions: LocalFunctions,
  birpcOptions:
    | BirpcOptions<RemoteFunctions>
    | (() => BirpcOptions<RemoteFunctions>),
) {
  const rpc = useRef<BirpcReturn<RemoteFunctions, LocalFunctions>>(undefined)

  useEffect(() => {
    const options =
      typeof birpcOptions === 'function' ? birpcOptions() : birpcOptions

    rpc.current = createBirpc<RemoteFunctions, LocalFunctions>(
      localFunctions,
      options,
    )

    return () => {
      rpc.current?.$close()
    }
  }, [])

  return {
    rpc,
  }
}
