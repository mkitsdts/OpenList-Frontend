import { Button, HStack, Input, Text, VStack } from "@hope-ui/solid"
import { createSignal } from "solid-js"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { bus, handleRespWithNotifySuccess, notify, r } from "~/utils"
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
  return (
    <ModalWrapper
      name="transfer_share"
      title={t("home.toolbar.transfer_share")}
      closeName="transfer_share_modal_close"
    >
      <VStack spacing="$2" alignItems="start">
        <Text>{t("home.toolbar.transfer_share_src_url")}</Text>
        <Input
          value={srcUrl()}
          onInput={(e) => setSrcUrl(e.currentTarget.value)}
          placeholder="https://..."
        />
        <Text>{t("home.toolbar.transfer_share_valid_code")}</Text>
        <Input
          value={validCode()}
          onInput={(e) => setValidCode(e.currentTarget.value)}
        />
      </VStack>
      <HStack spacing="$2" mt="$4" mb="$2" justifyContent="end">
        <Button
          onClick={() => {
            bus.emit("tool", "transfer_share_modal_close")
          }}
          colorScheme="neutral"
        >
          {t("global.cancel")}
        </Button>
        <Button
          loading={loading()}
          onClick={async () => {
            try {
              if (!srcUrl()) {
                throw new Error("Empty Source URL")
              }
              const resp = await ok()
              handleRespWithNotifySuccess(resp, () => {
                refresh()
              })
            } catch (e) {
              notify.error((e as Error).message)
            } finally {
              setSrcUrl("")
              setValidCode("")
              bus.emit("tool", "transfer_share_modal_close")
            }
          }}
        >
          {t("global.confirm")}
        </Button>
      </HStack>
    </ModalWrapper>
  )
}
