<template>
    <div id="app">
        <Home msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
import Home from "./views/Home.vue";

export default {
    name: "App",
    components: {
        Home,
    },
};
</script>

<style lang="less">
</style>
