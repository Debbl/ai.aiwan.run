import { createBirpc } from 'birpc'
import { useEffect, useRef } from 'react'
import type { BirpcOptions, BirpcReturn } from 'birpc'

type WorkerInstance = Worker | URL | string
type WorkerFn = () => WorkerInstance
type WorkerOption = WorkerInstance | WorkerFn

function isWorkerFn(scriptURL: WorkerOption): scriptURL is WorkerFn {
  return typeof scriptURL === 'function'
}

function isWorker(scriptURL: WorkerOption): scriptURL is Worker {
  return scriptURL instanceof Worker
}

export function useRPCWorker<
  WorkerFunctions extends object = Record<string, never>,
  LocalFunctions extends object = Record<string, never>,
>(
  scriptURL: WorkerOption,
  localFunctions: LocalFunctions,
  options?: {
    rpc?: Omit<BirpcOptions<WorkerFunctions>, 'post' | 'on' | 'serialize' | 'deserialize'>
    worker?: WorkerOptions
  },
) {
  const rpc = useRef<BirpcReturn<WorkerFunctions, LocalFunctions>>(undefined)

  useEffect(() => {
    const script = isWorkerFn(scriptURL) ? scriptURL() : scriptURL
    const worker: Worker = isWorker(script) ? script : new Worker(script, options?.worker)

    rpc.current = createBirpc<WorkerFunctions, LocalFunctions>(localFunctions, {
      ...options?.rpc,
      post: (data) => worker.postMessage(data),
      on: (fn) => worker.addEventListener('message', fn),
      serialize: (data) => data,
      deserialize: (e) => e.data,
      off: (fn) => worker.removeEventListener('message', fn),
    })

    return () => {
      rpc.current?.$close()
    }
  }, [])

  return {
    rpc,
  }
}
