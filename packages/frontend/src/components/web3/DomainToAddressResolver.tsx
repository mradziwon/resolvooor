import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { ContractIds } from '@deployments/deployments'
import { SupportedChainId, resolveDomainToAddress } from '@azns/resolver-core'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { contractTxWithToast } from '@utils/contractTxWithToast'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

export const DomainToAddressResolver: FC = () => {
  const { api, activeAccount, isConnected, activeSigner } = useInkathon()
  const [greeterMessage, setGreeterMessage] = useState<string>()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const form = useForm<{ newMessage: string }>()

  const updateGreeting = async () => {
    if (!activeAccount || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    // Gather form value
    const newMessage = form.getValues('newMessage')

    // Send transaction
    setUpdateIsLoading(true)
    const { address } = await resolveDomainToAddress(newMessage, {
      chainId: SupportedChainId.AlephZeroTestnet,
    })
    setGreeterMessage(address || '-')
    setUpdateIsLoading(false)
  }

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Resolve Domain To Address</h2>

        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              placeholder={updateIsLoading ? 'Loading…' : 'Address'}
              value={greeterMessage}
              disabled={true}
            />
          </FormControl>
        </Card>

        {/* Update Greeting */}
        {!!isConnected && (
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <form onSubmit={form.handleSubmit(updateGreeting)}>
              <Stack direction="row" spacing={2} align="end">
                <FormControl>
                  <FormLabel>Domain</FormLabel>
                  <Input disabled={updateIsLoading} {...form.register('newMessage')} />
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="purple"
                  isLoading={updateIsLoading}
                  disabled={updateIsLoading}
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </Card>
        )}
      </div>
    </>
  )
}
