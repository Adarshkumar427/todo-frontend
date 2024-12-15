<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";

const items = ref([

    { title: 'Home', href: '/', disabled: false },
]);
let token = null
const router = useRouter()
onMounted(() => {
    token = localStorage.getItem('token')
    if (!token) {
        router.push('/login')
    }
})
const text = ref("")
const snackbarMessage = ref("");
const snackbar = ref(false);
const backend = import.meta.env.VITE_BACKEND
async function todo() {
    const res = await fetch(`${backend}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            task: text.value,

        }),
    });

    const data = await res.json();
    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem("token")
            router.push('/login')
            return
        }
        console.log(data);

        snackbarMessage.value = data.message || "todo failed.";
        snackbar.value = true
        return;
    }


    snackbarMessage.value = data.message || "todo successful!";
    snackbar.value = true
    text.value = "";
    router.push("/")
}
</script>

<template>
    <v-container>

        <v-breadcrumbs :items="items" divider="/"></v-breadcrumbs>

        <h1>Create Todo</h1>
        <div style="display: flex; width:40%">
            <v-text-field label="text" variant="outlined" type="text" :rules="[
                e => !!e || 'todo is required',
                e => (e.length >= 3) || 'todo must be at least 3 character'
            ]" v-model="text"></v-text-field>
            <v-btn @click="todo" style="height:55px">create</v-btn>
        </div>



        <v-snackbar v-model="snackbar" location="top" color="blue" vertical>
            {{ snackbarMessage }}
            <template v-slot:actions>
                <v-btn @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>