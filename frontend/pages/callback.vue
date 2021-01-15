<template>
  <v-row justify="center" align="center" :class="['text-h1']"
    >REDIRECTING...</v-row
  >
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue } from 'nuxt-property-decorator'
import axios from 'axios'
import {configs} from '@/utils/configs.js'
@Component
export default class MyStore extends Vue {
  async mounted() {
    if (this.$route.query.token) {
      Cookies.set('token', this.$route.query.token)
      if(Cookies.get('redirect')){
        const redirect=Cookies.get('redirect');
        window.location.href=`${redirect}`;
        return
      }
      window.location.href = '/'
    } else {
      const token = Cookies.get('token')
      const { data } = await axios.post(`${configs.save_paypal_url}`, {
        token,
        email: this.$route.query.email,
      })
      if (data.status) {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/dashboard?error=save_paypal'
      }
    }
  }
}
</script>

