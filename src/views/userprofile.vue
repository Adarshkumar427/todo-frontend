<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userPhoto from "../assets/person.avif";
const router = useRouter();
const userDetails = ref();
const photoFile = ref();
const name = ref('')
const email = ref('')
const items = [{ title: "Home", href: "/", disabled: false }];
let token = localStorage.getItem("token");
const backend = import.meta.env.VITE_BACKEND
async function user() {
  const res = await fetch(`${backend}/users`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    alert("unable to fetch users");
  }

  const data = await res.json();
  console.log(data.user);

  userDetails.value = data.user;
  name.value = userDetails.value.name
  email.value = userDetails.value.email
}

onMounted(() => {
  if (!token) {
    router.push("/login");
  } else {
    user();
  }
});

const editMode = ref(false);
// const details = ref(userDetails.value);

async function save() {
  const backend = import.meta.env.VITE_BACKEND
  const res = await fetch(`${backend}/users`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
    })
  });
  if (!res.ok) {
    const data = await res.json()
    alert(data.message)
    return
  }

  userDetails.value.name = name.value;
  userDetails.value.email = email.value;
  if (photoFile.value) {
    await uploadPhoto()
  }
  editMode.value = false
}
async function uploadPhoto() {
  const formData = new FormData();
  console.log(photoFile.value);

  formData.append('photo', photoFile.value[0]);
  const backend = import.meta.env.VITE_BACKEND
  const res = await fetch(`${backend}/users/photo`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.message);
    return;
  }


  userDetails.value.photo = data.user.photo;
}


function getUserPhoto() {
  if (!userDetails.value?.photo) {
    return userPhoto
  }
  return 'http://localhost:5000' + userDetails.value?.photo
}

async function Delete() {
  const backend = import.meta.env.VITE_BACKEND

  const res = await fetch(`${backend}/users/photo`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`
    },
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.message)
  }
  userDetails.value.photo = undefined
}

</script>
<template>
  <v-container>
    <v-breadcrumbs :items="items" divider="/"></v-breadcrumbs>

    <div><v-avatar :image="getUserPhoto()" size="200"></v-avatar>
      <v-btn @click="Delete">Delete</v-btn>
    </div>
    <h1>Profile</h1>
    <v-card v-if="userDetails">

      <v-card-text v-if="!editMode">
        <p><b>Name:</b> {{ userDetails.name }}</p>
        <p><b>Email:</b> {{ userDetails.email }}</p>
        <div class="d-flex justify-end">
          <v-btn @click="editMode = true">Edit</v-btn>
        </div>
      </v-card-text>
      <v-card-text v-else>
        <v-text-field color="blue" variant="outlined" v-model="name" label="Name"
          placeholder="Enter your name"></v-text-field>
        <v-text-field color="blue" variant="outlined" v-model="email" label="Email"
          placeholder="Enter your email"></v-text-field>
        <v-file-input v-model="photoFile" accept="image/*" label="File input"></v-file-input>
        <div class="d-flex justify-end">
          <v-btn @click="editMode = false" color="red">cancel</v-btn>
          <v-btn @click="save" color="blue">save</v-btn>
        </div>
      </v-card-text>

    </v-card>
  </v-container>
</template>
