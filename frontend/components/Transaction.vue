<template>
  <v-card class="mx-auto pa-6" max-width="900" outlined>
    <p class="subtitle-1 font-weight-bold">Transaction Details</p>
    <v-divider class="ma-4"></v-divider>
    <p class="subtitle-1 font-weight-bold">Congratulations! you're successfully get access to the repo</p>
    <p class="subtitle-1 font-weight-bold">Transaction Block :</p>
    <a :href="transaction_url" >{{transaction_url}}</a>
    <p class="subtitle-1 font-weight-bold">Github Invitation Url :</p>
    <a :href="github_url" >{{github_url}}</a>

  </v-card>
</template>
<script lang=ts>
import Cookies from 'js-cookie'
import { Component, Vue, Prop,Emit } from 'nuxt-property-decorator'
import { configs } from '@/utils/configs.js'
import Detail from '@/components/Detail.vue'
import axios from 'axios'

@Component({
  components: {
    Detail,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: false }) readonly transaction_url!: object
  @Prop({ required: false }) readonly github_url!: string

}
</script>
