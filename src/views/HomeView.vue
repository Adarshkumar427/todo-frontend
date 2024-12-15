<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter()
const todos = ref([])
const task = ref('');
const count = ref(0);
const page = ref(1)
const limit = ref(10)
let token = null
let totalPages = computed(() => Math.ceil(count.value / limit.value))

onMounted(() => {
  token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
  } else {
    fetchtodos()
  }
})

async function fetchtodos() {
  const backend = import.meta.env.VITE_BACKEND

  const res = await fetch(`${backend}/todos?page=${page.value}&limit=${limit.value}`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token} `
    }
  })

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token")
      router.push('/login')
      return
    }
    return alert('fetch error');
  }

  todos.value = data.todos;
  count.value = data.count


}
watch([page, limit], fetchtodos)
watch(limit, () => page.value = 1)

async function updateTodo(todo, checked) {
  const backend = import.meta.env.VITE_BACKEND
  console.log(todo, checked);
  const response = await fetch(`${backend}/todos/${todo._id}`, {

    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      done: checked,
    }),
  })

  const result = await response.json()
  if (!response.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token")
      router.push('/login')
      return
    }
    console.log('Unable to fetch todos', result.message);

  }

}

async function editTaskName(todo) {
  const backend = import.meta.env.VITE_BACKEND
  const response = await fetch(`${backend}/todos/${todo._id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      task: task.value,
    })
  })
  const result = await response.json()
  todo.task = task.value;
  if (!response.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token")
      router.push('/login')
      return
    }
    console.log('unable to update task name', result.message);
  }
}

function toggleEdit(todo) {
  console.log(todo);

  task.value = todo.task
  todo.isEditing = !todo.isEditing;
  if (!todo.isEditing) {
    editTaskName(todo);
  }
}

function enableEditing(todo) {
  task.value = todo.task;
  todo.isEditing = true
}

async function deleteTodo(todo) {
  const backend = import.meta.env.VITE_BACKEND
  const res = await fetch(`${backend}/todos/${todo._id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token")
      router.push('/login')
      return
    }
    return console.log("hello")
  }
  todos.value = todos.value.filter(e => e._id !== todo._id)
}


</script>

<template>
  <v-container>
    <h1>Todos</h1>
    <div class="d-flex justify-end"><router-link to="/todo"><v-btn>create
          todo</v-btn></router-link>
      <span>
        <v-select class="ml-2 " max-width="200" label="Limit" v-model="limit" :items="[5, 10, 15, 20]"></v-select>
      </span>
    </div>

    <div>
      <v-row class="mt-2    ">
        <v-col cols="12" md="4" lg="3" v-for="todo in todos" :key="index">

          <v-card elevation="12">
            <v-card-title style="display: flex;">
              <div v-if="!todo.isEditing">{{ todo.task || 'untitle' }}</div>
              <v-text-field v-else v-model="task" @keyup.enter="toggleEdit(todo)"></v-text-field>
              <v-btn icon class="ml-2" color="black" size="x-small" @click="enableEditing(todo)" v-if="!todo.isEditing">
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>
              <template v-else>
                <v-btn icon class="ml-2" color='red' size="small" @click="todo.isEditing = false">
                  <v-icon icon="mdi-close"></v-icon>
                </v-btn>
                <v-btn icon class="ml-2" color="green" size="small" @click="toggleEdit(todo)">
                  <v-icon icon="mdi-check"></v-icon>
                </v-btn>
              </template>

              <v-btn @click="deleteTodo(todo)" class="ml-16" color="red" size="x-small" icon="mdi-close"></v-btn>

            </v-card-title>

            <v-checkbox label="completed" color="pink" v-model="todo.done"
              @update:model-value="updateTodo(todo, $event)"></v-checkbox>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination class="mt-6" v-model="page" :length="totalPages" rounded="circle"></v-pagination>
      <!-- limit count page totalPages(computed) -->
      <!-- modification on fetchApi  -->
      <!-- page variable in url,setcount after getting the data ,watch for page variable changes-->
      <!-- v-pagination at the end -->
    </div>
  </v-container>
</template>
