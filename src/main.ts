import * as core from '@actions/core'
import { wait } from './wait'
import { graphql } from 'gql.tada'
import { request } from 'graphql-request'
const ProjectsQuery = graphql(`
  query projects($after: String) {
    projects(after: $after, first: 10) {
      edges {
        node {
          id
        }
      }
    }
  }
`)

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const { projects } = await request(
      'https://backboard.railway.app/graphql/v2',
      graphql(`
        query projects {
          projects {
            edges {
              node {
                id
              }
            }
          }
        }
      `),
      {},
      {
        Authorization: `Bearer be526a39-4c2a-4393-93e4-20ee53142b52`
      }
    )

    console.dir({ projects }, { depth: 9 })

    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
