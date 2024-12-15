<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute, RouterLink, RouterView } from "vue-router";
let route = useRoute()
const router = useRouter()

const isLogin = ref(false)
function isLoggedIn() {
  const publicPages = [
    '/login', '/register'
  ]
  isLogin.value = !(publicPages.some((e) => e === route.path))
}
onMounted(() => {
  isLoggedIn()
})
watch(() => route.path, isLoggedIn)

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
  alert('Logout user')

}

</script>

<template>
  <nav>
    <!-- <RouterLink to="/login">login</RouterLink> -->
    <v-btn v-if="isLogin" color="red" class="log" @click="logout">Log out</v-btn>
    <v-btn @click="router.push('/userprofile')" icon="mdi-account" class="ml-2 " color="blue "></v-btn>
  </nav>

  <RouterView />
</template>

<style scoped>
a {
  padding: 0 1rem;

}

.log {
  margin-left: 200px;
  margin-top: 2px;
}

nav {
  display: flex;
  justify-content: end;
  padding: 10px
}
</style>
