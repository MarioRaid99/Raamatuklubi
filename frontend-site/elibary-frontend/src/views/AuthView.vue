<template>
  <div class="container py-4" style="max-width: 520px">
    <h2 class="mb-3">Auth</h2>

    <div class="btn-group mb-3 w-100">
      <button
        class="btn btn-outline-primary"
        :class="{ active: mode === 'login' }"
        @click="mode = 'login'"
      >
        Login
      </button>
      <button
        class="btn btn-outline-primary"
        :class="{ active: mode === 'register' }"
        @click="mode = 'register'"
      >
        Register
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="mb-2">
          <input
            class="form-control"
            v-model="form.Email"
            placeholder="Email"
          />
        </div>

        <div class="mb-2">
          <input
            class="form-control"
            v-model="form.Password"
            placeholder="Password"
            type="password"
          />
        </div>

        <div class="mb-2" v-if="mode === 'register'">
          <input
            class="form-control"
            v-model="form.FirstName"
            placeholder="First name"
          />
        </div>

        <div class="mb-2" v-if="mode === 'register'">
          <input
            class="form-control"
            v-model="form.LastName"
            placeholder="Last name"
          />
        </div>

        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="submit"
        >
          {{ loading ? "..." : mode.toUpperCase() }}
        </button>

        <div v-if="error" class="alert alert-danger mt-3 mb-0">
          {{ error }}
        </div>

        <div v-if="isLoggedIn" class="alert alert-success mt-3 mb-0">
          Logged in as: <strong>{{ state.user?.Email }}</strong>
          (role: <strong>{{ role }}</strong>)
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-dark" @click="doLogout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="text-muted mt-3 mb-0">
      Admin näeb Events lehte. Tavakasutaja suunatakse siia tagasi.
    </p>
  </div>
</template>

<script>
import { login, register } from "@/services/authApi";
import { useAuth } from "@/services/authStore";

export default {
  name: "AuthView",

  data() {
    return {
      mode: "login",
      loading: false,
      error: "",
      form: {
        Email: "",
        Password: "",
        FirstName: "",
        LastName: "",
      },
    };
  },

  computed: {
    auth() {
      return useAuth();
    },
    state() {
      return this.auth.state;
    },
    isLoggedIn() {
      return this.auth.isLoggedIn.value;
    },
    role() {
      return this.auth.role.value;
    },
  },

  methods: {
    async submit() {
      this.loading = true;
      this.error = "";
      try {
        let result;

        if (this.mode === "login") {
          result = await login({
            Email: this.form.Email,
            Password: this.form.Password,
          });
        } else {
          result = await register({
            Email: this.form.Email,
            Password: this.form.Password,
            FirstName: this.form.FirstName,
            LastName: this.form.LastName,
          });
        }

        // eeldame backend tagastab: { token, user }
        this.auth.setAuth(result.token, result.user);

        // kui admin, mine events lehele
        if (result.user?.Role === "ADMIN") {
          this.$router.push("/events");
        } else {
          this.$router.push("/");
        }
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    doLogout() {
      this.auth.logout();
      this.$router.push("/");
    },
  },
};
</script>
