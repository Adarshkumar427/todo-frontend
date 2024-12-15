<!-- <script setup>
import { ref } from 'vue'
const snackbar = ref(false)
</script>
<template>
    <h1>snack page</h1>

</template> -->
<!-- <script setup>

import { ref, computed } from 'vue';

const username = ref('');
const email = ref('');

// Define rules using computed properties
const userRules = computed(() => [
    (value) => {
        if (value?.length >= 3) return true;
        return 'First name must be at least 3 characters.';
    },
]);

const emailRules = computed(() => [
    (value) => {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;
        return 'Must be valid email.';
    },
]);


</script>

<template>
    <v-sheet class="mx-auto" width="300">
        <v-form fast-fail @submit.prevent>
            <v-text-field v-model="username" :rules="userRules" label="username"></v-text-field>

            <v-text-field v-model="email" :rules="emailRules" label="email"></v-text-field>

            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
        </v-form>
    </v-sheet>
</template> -->
<!-- show1: false,
        show2: true,
        password: 'Password', -->
<script setup>
import { ref } from 'vue';

// Reactive state variables
const show1 = ref(false); // Controls the visibility of the password
const password = ref('Password');

// Validation rules
const rules = {
    required: (value) => !!value || 'Required.',
    min: (value) => value.length >= 8 || 'At least 8 characters.',
};
</script>

<template>
    <v-container>
        <v-form>
            <!-- Password Field with Toggle Visibility -->
            <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" label="Normal with hint text"
                name="input-10-1" counter @click:append="show1 = !show1"></v-text-field>
        </v-form>
    </v-container>
</template>