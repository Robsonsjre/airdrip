import _ from 'lodash'
import { useMemo } from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

const states = {
  idle: 'idle',
  validate: 'validate',
  process: 'process',
  success: 'success',
  failure: 'failure'
}

const events = {
  save: 'save',
  reset: 'reset'
}

async function invoke (context, event, guard) {
  return guard({ context, event })
}

const handle = assign({
  error: (context, event) => {
    console.error(_.get(event, 'data'), true)
    return _.toString(_.get(event, 'data.message'))
  },
  message: (context, event) =>
    _.toString(_.get(event, 'data._explanation')) ||
    _.toString(_.get(event, 'data.message'))
})

export default function useAtomicMachine ({
  id,
  onPrepare,
  onValidate,
  onProcess
}) {
  const configuration = useMemo(
    () =>
      Machine({
        id,
        initial: states.idle,
        context: {
          payload: null,
          error: null,
          message: null
        },
        states: {
          [states.idle]: {
            entry: assign({ error: null, message: null }),
            on: {
              [events.save]: states.validate
            }
          },
          [states.validate]: {
            entry: assign({
              payload: (context, event) => _.get(event, 'payload')
            }),
            invoke: {
              src: (context, event) => invoke(context, event, onValidate),
              onDone: {
                target: states.process
              },
              onError: {
                actions: handle,
                target: states.failure
              }
            }
          },
          [states.process]: {
            invoke: {
              src: (context, event) => invoke(context, event, onProcess),
              onDone: {
                target: states.success
              },
              onError: {
                actions: handle,
                target: states.failure
              }
            }
          },
          [states.success]: {
            on: {
              [events.save]: states.validate
            }
          },
          [states.failure]: {
            on: {
              [events.reset]: states.idle,
              [events.save]: states.validate
            }
          }
        }
      }),
    [id, onValidate, onProcess]
  )
  const machine = useMachine(configuration)

  return {
    current: machine[0],
    send: machine[1],
    states,
    events,
    onPrepare
  }
}
