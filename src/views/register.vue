<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
        router.push('/')
    }

})

const name = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")

const snackbarMessage = ref(false)
const show1 = ref(false);
const show2 = ref(false);

const form = ref()

async function register() {
    const backend = import.meta.env.VITE_BACKEND
    const { valid } = await form.value.validate()
    if (!valid) {
        return
    }
    try {

        const res = await fetch(`${backend}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,

            }),
        });

        const data = await res.json();
        if (!res.ok) {
            console.log(data);

            snackbarMessage.value = data.message || "Registration failed.";
            return;
        }

        snackbarMessage.value = data.message || "Registration successful!";

        name.value = "";
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
    } catch (error) {
        snackbarMessage.value = error.message;
    }
}
</script>

<template>
    <v-container class="mt-4">
        <v-card class="pa-6 mx-auto">
            <v-card-title class="text-center"
                style="text-decoration: underline;font-size:70px ;margin:20px ; padding:10px">
                Resister here
            </v-card-title>
            <v-card-item>
                <v-sheet>

                    <v-form ref="form">
                        <v-text-field variant="solo" v-model="name" :rules="[
                            e => !!e || 'username is required',
                            e => (e.length >= 3) || 'password must be at least 3m character'
                        ]" type="string" label="username" prepend-inner-icon="mdi-account"></v-text-field>
                        <v-text-field variant="solo" v-model="email" :rules="[
                            e => !!e || 'email is required',
                            e => /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(e) || 'email is invalid'
                        ]" type="email" label="Email" prepend-inner-icon="mdi-email"></v-text-field>
                        <v-text-field variant="solo" v-model="password" :rules="[
                            e => !!e || 'password is required',
                            e => (e.length >= 5 && e.length <= 15) || 'password must be in range 5-15 '
                        ]" :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
                            label="password" prepend-inner-icon="mdi-key"
                            @click:append-inner="show1 = !show1"></v-text-field>
                        <v-text-field variant="solo" v-model="confirmPassword"
                            :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'"
                            :rules="[
                                e => !!e || 'password is required',
                                e => (e.length >= 5 && e.length <= 15) || 'password must be in range 5-15 ',
                                e => e === password || 'password do not match'
                            ]" label="confirm-Password" prepend-inner-icon="mdi-key"
                            @click:append-inner="show2 = !show2"></v-text-field>
                    </v-form>
                    <v-snackbar v-model="snackbarMessage" location="top" color="blue" vertical>{{ snackbarMessage }}
                        <template v-slot:actions>
                            <v-btn @click="snackbarMessage = false">close</v-btn>
                        </template>
                    </v-snackbar>
                    <v-btn @click="register" color="error" block>Submit</v-btn>

                </v-sheet>
            </v-card-item>
        </v-card>
    </v-container>
</template>
