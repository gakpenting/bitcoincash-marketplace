<template>
  <v-row justify="center" align="center" :class="['text-h1']"
    >
  <v-card

    class="mx-auto my-12"
    max-width="1000"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      :src="item.openGraphImageUrl"
    ></v-img>

    <v-card-title>{{item.name}}</v-card-title>

    <v-card-text>



      <div>{{item.description}}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>$ {{item.amount}}</v-card-title>



    <v-card-actions>
      <v-btn
         v-if="item.username !== username_"
        color="deep-purple lighten-2"
        text
        :disabled="disabled"
        @click="buyNow(item.repo_id,item.username,item.name)"
      >
        BUY NOW
      </v-btn>

        <v-btn
        v-if="item.username === username_"
              :disabled="disabled"
                class="d-flex justify-end"
                color="deep-purple lighten-2"
                :href="item.url"
                target="_blank"
                text
              >
                GO TO URL
              </v-btn>
    </v-card-actions>
  </v-card>
</v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue } from 'nuxt-property-decorator'
import {configs} from '@/utils/configs.js'
import axios from 'axios'
@Component
export default class MyStore extends Vue {
public disabled:boolean=false
public username_:string=""
public item:object={}
async mounted(){
  Cookies.remove("redirect")
  const username = this.$route.query.username
      const name = this.$route.query.name
      const url=configs.repo_detail_url
      const {data}=await axios.post(`${url}`,{username,name})
this.item=data


  if(Cookies.get("token")){
        const token=Cookies.get("token")
        const _url = configs.get_profile_url
        const profile = await this.$axios.get(`${_url}?token=${token}`)
        this.username_ = profile.data.data.login
      }
}

async buyNow(id:any,username:string,name:string) {

    this.disabled=true;
    const token = Cookies.get('token')
    if(!token){
      window.location.href="/login"
       Cookies.set('redirect', `/${username}/${name}`)
      return
    }
    Cookies.remove("redirect")
    const url=<string>configs.buy_paypal_url;
    const res = await this.$axios.post(url, { id, token })
    if (res.data) {
      const link=res.data.result.links.filter((a:any)=>a.rel==="approve")[0].href
      window.location.href=link;
    }else{
      this.disabled=false;
      alert("error")
    }
  }
}
</script>

