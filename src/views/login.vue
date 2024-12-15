<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
        router.push('/')
    }
})

const email = ref("adams@gmail.com")
const password = ref("12345")
const router = useRouter()



let snackbar = ref(false)
let snackbarMessage = ref("")
const form = ref()

const show1 = ref(false);

async function login() {
    const backend = import.meta.env.VITE_BACKEND
    const { valid } = await form.value.validate();
    if (!valid) {
        return;
    }
    const res = await fetch(`${backend}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    });
    // console.log(res);

    const data = await res.json();
    // console.log(data);
    if (!res.ok) {

        snackbarMessage.value = data.message || "password not matched as register password.";
        snackbar.value = true;
        return;
    }


    //if already login go to home page

    email.value = "";
    password.value = "";
    localStorage.setItem('token', data.token)
    // todo: move to home page
    router.push("/")
}
</script>
<template>
    <v-container>

        <v-card class="pa-6 mx-auto">
            <v-card-title class="text-center text-black mb-10" style="text-decoration: underline ;font-size:50px">Login
                Here</v-card-title>
            <v-card-item>
                <v-sheet>

                    <v-form ref="form">
                        <v-text-field variant="solo" v-model="email" :rules="[
                            e => !!e || 'email is required',
                            e => /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(e) || 'email is invalid'
                        ]" type="email" label="Email" prepend-inner-icon="mdi-email"></v-text-field>
                        <v-text-field variant="solo" v-model="password" :rules="[
                            e => !!e || 'password is required',
                            e => (e.length >= 5 && e.length <= 15) || 'password must be in range 5-15 '
                        ]" :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
                            @click:append-inner="show1 = !show1" label="Password"
                            prepend-inner-icon="mdi-key"></v-text-field>
                    </v-form>
                    <v-snackbar v-model="snackbar" location="top" color="red" vertical>
                        {{ snackbarMessage }}
                        <template v-slot:actions>
                            <v-btn @click="snackbar = false">Close</v-btn>
                        </template>
                    </v-snackbar>
                    <v-btn @click="login" color="blue-darken-3" block class="mt-2">
                        <span>Log In</span></v-btn>
                    <v-btn color="red-lighten-1" class="mt-3 mb-2" block to="/register">register</v-btn>

                </v-sheet>
            </v-card-item>
        </v-card>
    </v-container>
</template>
