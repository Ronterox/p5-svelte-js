<script lang="ts">
    import { onMount } from "svelte";
    import { DiscordSDKMock } from "@discord/embedded-app-sdk";
    import game from "./Game";
    import P5 from "p5";

    type Optional<T> = T | null | undefined;

    onMount(() => {
        new P5(game);
        initSDK();
    });

    const BASE_URL = "https://cdn.discordapp.com";

    let channelName: Optional<string>,
        userNickname: Optional<string>,
        userAvatar: Optional<string>;

    async function initSDK() {
        const discordSDK = new DiscordSDKMock(
            "CLIENT_ID",
            "GUILD_ID",
            "COMMANDS",
        );

        await discordSDK.ready();
        console.log("Discord SDK is ready");

        const auth = await discordSDK.commands.authenticate({
            access_token: "ACCESS_TOKEN",
        });

        channelName = (
            await discordSDK.commands.getChannel({ channel_id: "CHANNEL_ID" })
        ).name;
        userNickname = auth.user.username;
        userAvatar = auth.user.avatar || `${BASE_URL}/embed/avatars/0.png`;
    }

</script>

<main>
    {#if channelName && userNickname && userAvatar}
        <h1>Welcome to {channelName}</h1>
        <h2>{userNickname}</h2>
        <img src={userAvatar} alt={userNickname} width="150" height="150" />
    {:else}
        <h1>Loading...</h1>
    {/if}
</main>

<style>
</style>
