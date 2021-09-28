import { BeeResponseError } from '@ethersphere/bee-js'
import chalk from 'chalk'
import { Utils } from 'furious-commander'
import { describeCommand, invokeTestCli } from '../utility'

function expectErrorsToDeepEqual(actual: string[], expected: string[]): void {
  expect(actual).toStrictEqual(expected.map(x => chalk.red(x)))
}

describeCommand('Top-Level Error Handler', ({ consoleMessages }) => {
  it('should handle normal errors', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw Error('Oops!')
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'The command failed with error message: Oops!',
      '',
      'There may be additional information in the Bee logs.',
    ])
  })

  it('should handle string errors', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw 'Oops!'
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'The command failed with error message: Oops!',
      '',
      'There may be additional information in the Bee logs.',
    ])
  })

  it('should handle empty errors', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw Error()
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'The command failed, but there is no error message available.',
      '',
      'Check your Bee log to learn if your request reached the node.',
    ])
  })

  it('should handle undefined errors', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw Error(undefined as unknown as string)
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'The command failed, but there is no error message available.',
      '',
      'Check your Bee log to learn if your request reached the node.',
    ])
  })

  it('should handle 500 errors with custom message', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw new BeeResponseError(500, 'This should be printed')
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'Bee responded with HTTP 500 (Internal Server Error).',
      '',
      'The error message is: This should be printed',
      '',
      'There may be additional information in the Bee logs.',
    ])
  })

  it('should handle 500 errors with default message', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw new BeeResponseError(500, 'Internal Server Error')
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'Bee responded with HTTP 500 (Internal Server Error).',
      '',
      'There may be additional information in the Bee logs.',
    ])
  })

  it('should handle 404 errors with custom message', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw new BeeResponseError(404, 'This should be printed')
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'Bee responded with HTTP 404 (Not Found).',
      '',
      'The error message is: This should be printed',
      '',
      'There may be additional information in the Bee logs.',
    ])
  })

  it('should handle 404 errors with default message', async () => {
    jest.spyOn(Utils, 'getSourcemap').mockImplementation(() => {
      throw new BeeResponseError(404, 'Not Found')
    })
    await invokeTestCli(['status'])
    expectErrorsToDeepEqual(consoleMessages, [
      'Bee responded with HTTP 404 (Not Found).',
      '',
      'There may be additional information in the Bee logs.',
    ])
  })
})