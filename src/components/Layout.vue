<template>
    <main>
        <Nav/>
            <slot />
        <Footer/>
    </main>
</template>

<script>
import Navigation from "../components/Nav.vue";
import Footer from "../components/Footer.vue";
export default {
    name: "Layout",
    components: {Navigation, Footer},
}
</script>

<style scoped>
    main .content {
        min-height: calc(100vh - 4rem)!important;
    }
    @media only screen and (max-width: 767px) {
        .content {
            margin-top: 96px
        }
    }
</style>

