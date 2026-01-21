<template>
  <div class="auth-page">
    <div class="container py-4 py-lg-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-6 col-xl-5">
          <!-- Header -->
          <header class="mb-3 text-center">
            <h1 class="page-title mb-1">Konto</h1>
            <p class="page-subtitle mb-0">
              Logi sisse või loo uus kasutaja. Admin suunatakse Events lehele.
            </p>
          </header>

          <!-- Card -->
          <div class="card card-elevated">
            <div class="card-body p-3 p-md-4">
              <!-- Mode switch -->
              <div class="btn-group w-100 mb-3" role="group" aria-label="Auth mode">
                <button
                  class="btn"
                  :class="mode === 'login' ? 'btn-primary' : 'btn-outline-primary'"
                  type="button"
                  @click="mode = 'login'"
                  :disabled="loading"
                >
                  Login
                </button>
                <button
                  class="btn"
                  :class="mode === 'register' ? 'btn-primary' : 'btn-outline-primary'"
                  type="button"
                  @click="mode = 'register'"
                  :disabled="loading"
                >
                  Register
                </button>
              </div>

              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    class="form-control"
                    v-model.trim="form.Email"
                    placeholder="nimi@domeen.ee"
                    type="email"
                    autocomplete="email"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Parool</label>
                  <input
                    class="form-control"
                    v-model="form.Password"
                    placeholder="Sisesta parool"
                    type="password"
                    autocomplete="current-password"
                  />
                </div>

                <div v-if="mode === 'register'" class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label">Eesnimi</label>
                    <input
                      class="form-control"
                      v-model.trim="form.FirstName"
                      placeholder="Eesnimi"
                      autocomplete="given-name"
                    />
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Perenimi</label>
                    <input
                      class="form-control"
                      v-model.trim="form.LastName"
                      placeholder="Perenimi"
                      autocomplete="family-name"
                    />
                  </div>
                </div>

                <button class="btn btn-primary w-100 mt-3" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ mode === "login" ? "Logi sisse" : "Loo konto" }}
                </button>
              </form>

              <div v-if="error" class="alert alert-danger mt-3 mb-0">
                {{ error }}
              </div>

              <div v-if="isLoggedIn" class="mt-3">
                <div class="alert alert-success mb-0">
                  <div class="fw-semibold mb-1">Sisselogimine õnnestus</div>
                  <div class="small">
                    Kasutaja: <strong>{{ state.user?.Email }}</strong>
                    <span class="text-muted"> | roll: </span>
                    <strong>{{ role }}</strong>
                  </div>

                  <div class="mt-2 d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-outline-dark" type="button" @click="doLogout">
                      Logi välja
                    </button>
                    <button
                      v-if="role === 'ADMIN'"
                      class="btn btn-sm btn-outline-primary"
                      type="button"
                      @click="$router.push('/events')"
                    >
                      Mine Events
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" type="button" @click="$router.push('/')">
                      Ava avaleht
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="text-muted small mt-3 mb-0 text-center">
            Admin näeb Events lehte. Tavakasutaja suunatakse avalehele.
          </p>
        </div>
      </div>
    </div>
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

        this.auth.setAuth(result.token, result.user);

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

<style scoped>
.auth-page {
  background: radial-gradient(1200px 600px at 20% 0%, rgba(13, 110, 253, 0.12), transparent 60%),
    radial-gradient(900px 500px at 100% 10%, rgba(25, 135, 84, 0.10), transparent 55%),
    linear-gradient(180deg, rgba(13, 110, 253, 0.06), transparent 240px);
  min-height: 100%;
}

.page-title {
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: #6c757d;
}

.card-elevated {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
</style>
