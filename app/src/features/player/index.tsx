import { H2, H3, H4, Image, XStack, YStack } from "tamagui";
import { Outlet, useMatch } from "react-router";
import { Page } from "@/page/page";
import { Icon } from "@/common/icon/icon";
import { Archive, Calendar, Grid } from "@tamagui/feather-icons";
import React from "react";
import { trpc } from "@/common/trpc/trpc";

export function PlayerScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  const groups = trpc.player.groups.useQuery();
  if (!player) {
    return <H2>No player found</H2>;
  }
  return (
    <Page>
      <Page.LeftPanel>
        <XStack ai="center" bg="$backgroundStrong" p="$2" br="$2" m="$2" space="$2">
          <Icon icon={Calendar} size="$6" />
          <H4>Activity</H4>
        </XStack>
        <XStack ai="center" bg="$backgroundStrong" p="$2" br="$2" m="$2" space="$2">
          <Icon icon={Archive} size="$6" />
          <H4>Inventory</H4>
        </XStack>

        <XStack ai="stretch" flexWrap="wrap">
          {groups.data?.map(group => (
            <YStack p="$2" br="$2" width={100} flexGrow={1} maxWidth="100%">
              <YStack ai="center" bg="$backgroundStrong" p="$2" br="$2" flex={1}>
                <XStack ai="flex-end">
                  <Image
                    src={`https://images.cuppazee.app/types/64/${group.icons[1]}.png`}
                    width="$3"
                    height="$3"
                  />
                  <Image
                    src={`https://images.cuppazee.app/types/64/${group.icons[0]}.png`}
                    width="$4"
                    height="$4"
                    mx="$-2"
                  />
                  <Image
                    src={`https://images.cuppazee.app/types/64/${group.icons[2]}.png`}
                    width="$3"
                    height="$3"
                  />
                </XStack>
                <H4 textAlign="center">{group.name}</H4>
              </YStack>
            </YStack>
          ))}
        </XStack>
        <XStack ai="center" bg="$backgroundStrong" p="$2" br="$2" m="$2" space="$2">
          <Image
            src={`https://munzee.global.ssl.fastly.net/images/clan_logos/11h.png`}
            width="$3"
            height="$3"
            borderRadius={100}
          />
          <H4 numberOfLines={1}>The Cup of Coffee Clan</H4>
        </XStack>
        <XStack ai="center" bg="$backgroundStrong" p="$2" br="$2" m="$2" space="$2">
          <Icon icon={Grid} size="$6" />
          <H4>Capture Grids</H4>
        </XStack>
        <YStack flex={1} />
        <XStack ai="center" bg="$backgroundStrong" p="$2" br="$2" m="$2" space="$2">
          <Image
            src={`https://api.cuppazee.app/player/${player}/avatar`}
            width="$3"
            height="$3"
            borderRadius={100}
          />
          <H3>{player}</H3>
        </XStack>
      </Page.LeftPanel>
      <Outlet />
    </Page>
  );
}
