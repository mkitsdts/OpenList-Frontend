import { Button, Input, Text, VStack } from "@hope-ui/solid"
import { createSignal, onCleanup } from "solid-js"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { bus, handleRespWithNotifySuccess, r } from "~/utils"
import { ModalWrapper } from "./ModalWrapper"

export const TransferShare = () => {
  const t = useT()
  const { refresh } = usePath()
  const { pathname } = useRouter()
  const [srcUrl, setSrcUrl] = createSignal("")
  const [validCode, setValidCode] = createSignal("")
  const [loading, ok] = useFetch(
    (): Promise<any> =>
      r.post("/fs/transfer", {
        url: srcUrl(),
        dst_dir: pathname(),
        valid_code: validCode(),
      }),
  )

  const handler = (name: string) => {
    if (name === "transfer_share") {
      bus.emit("tool", "transfer_share_modal")
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })

  return (
    <ModalWrapper
      name="transfer_share_modal"
      title="home.toolbar.transfer_share"
    >
      <VStack spacing="$2" alignItems="start">
        <Text>Source URL</Text>
        <Input
          value={srcUrl()}
          onInput={(e) => setSrcUrl(e.currentTarget.value)}
          placeholder="http://..."
        />
        <Text>Valid Code (Optional)</Text>
        <Input
          value={validCode()}
          onInput={(e) => setValidCode(e.currentTarget.value)}
          placeholder="Code"
        />
        <Button
          loading={loading()}
          onClick={async () => {
            const resp = await ok()
            handleRespWithNotifySuccess(resp, () => {
              refresh()
              bus.emit("tool", "transfer_share_modal") // close modal
            })
          }}
          w="$full"
        >
          {t("global.confirm")}
        </Button>
      </VStack>
    </ModalWrapper>
  )
}
