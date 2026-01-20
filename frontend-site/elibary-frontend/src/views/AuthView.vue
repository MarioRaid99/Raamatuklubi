<template>
  <div class="container py-4" style="max-width: 720px">
    <h3>Login / Register</h3>

    <div class="alert alert-info mt-3" v-if="user">
      Logged in as <strong>{{ user.Email }}</strong> ({{ user.Role }})
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <div class="d-flex gap-2">
          <button
            class="btn"
            :class="mode === 'login' ? 'btn-primary' : 'btn-outline-primary'"
            @click="mode = 'login'"
            :disabled="loading"
          >
            Login
          </button>
          <button
            class="btn"
            :class="mode === 'register' ? 'btn-primary' : 'btn-outline-primary'"
            @click="mode = 'register'"
            :disabled="loading"
          >
            Register
          </button>
        </div>

        <div class="mt-3">
          <label class="form-label">Email</label>
          <input class="form-control" v-model="form.Email" type="email" />
        </div>

        <div class="mt-3">
          <label class="form-label">Password</label>
          <input class="form-control" v-model="form.Password" type="password" />
        </div>

        <div class="row mt-3" v-if="mode === 'register'">
          <div class="col-md-6">
            <label class="form-label">First name</label>
            <input class="form-control" v-model="form.FirstName" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Last name</label>
            <input class="form-control" v-model="form.LastName" />
          </div>
        </div>

        <div class="mt-3 d-grid">
          <button class="btn btn-success" @click="submit" :disabled="loading">
            {{ mode === "login" ? "Login" : "Create account" }}
          </button>
        </div>

        <div class="mt-3 d-grid" v-if="token">
          <button class="btn btn-outline-danger" @click="logout" :disabled="loading">
            Logout
          </button>
        </div>

        <div v-if="error" class="alert alert-danger mt-3 mb-0">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/services/authApi";
import { clearAuth, getToken, getUser, setAuth } from "@/services/authStore";

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
      token: "",
      user: null,
    };
  },
  created() {
    this.token = getToken();
    this.user = getUser();
  },
  methods: {
    async submit() {
      this.loading = true;
      this.error = "";
      try {
        const payload = {
          Email: this.form.Email,
          Password: this.form.Password,
        };

        let result;
        if (this.mode === "register") {
          result = await register({
            ...payload,
            FirstName: this.form.FirstName,
            LastName: this.form.LastName,
          });
        } else {
          result = await login(payload);
        }

        setAuth(result.token, result.user);
        this.token = result.token;
        this.user = result.user;

        this.$router.push("/");
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      clearAuth();
      this.token = "";
      this.user = null;
      this.$router.push("/");
    },
  },
};
</script>
