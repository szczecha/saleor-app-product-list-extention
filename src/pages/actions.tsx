import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Text } from "@saleor/macaw-ui";

/**
 * This is example of using AppBridge, when App is mounted in Dashboard
 * See more about AppBridge possibilities
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/app-bridge.md
 *
 * -> You can safely remove this file!
 */
const ActionsPage = () => {
  const { appBridge, appBridgeState } = useAppBridge();

  const navigateToProducts = () => {
    appBridge?.dispatch(
      actions.Redirect({
        to: `/products`,
      })
    );
  };

  return (
    <Box padding={8} display={"flex"} flexDirection={"column"} gap={6} __maxWidth={"640px"}>
      <Box>
        <Text as={"p"}>
          <b>Welcome {appBridgeState?.user?.email}!</b>
        </Text>
        <Text as={"p"}>Installing the app in the Dashboard gave it superpowers such as:</Text>
      </Box>
      <Box>
        <Text as={"h2"} size={8} marginBottom={2}>
          AppBridge actions
        </Text>
        <Text color="default2">
          💡 You can use AppBridge to trigger dashboard actions, such as notifications or redirects.
        </Text>
        <Box display={"flex"} gap={4} gridAutoFlow={"column"} marginY={4}>
          <Button
            variant={"secondary"}
            onClick={() => {
              appBridge?.dispatch({
                type: "notification",
                payload: {
                  status: "success",
                  title: "You rock!",
                  text: "This notification was triggered from Saleor App",
                  actionId: "message-from-app",
                },
              });
            }}
          >
            Trigger notification 📤
          </Button>
          <Button variant={"secondary"} onClick={navigateToProducts}>
            Go to products ➡️
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ActionsPage;
