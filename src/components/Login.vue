<template>
    <div class="login box">
        <img src="../../static/image/u=3301179236,2042945196&fm=26&gp=0.jpg" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.png" alt="">
                <p>百知教育给你最优质的学习体验!</p>
            </div>
            <div class="login_box">
                <div class="title">
                    <span>密码登录</span>
                    <span>短信登录</span>
                </div>
                <div class="inp" v-if="">
                    <input type="text" placeholder="用户名 / 手机号码" class="user" v-model="username">
                    <input type="password" name="" class="pwd" placeholder="密码" v-model="password">
                    <div id="geetest1"></div>
                    <div class="rember">
                        <p>
                            <input type="checkbox" class="no" v-model="recall">
                            <span>记住密码</span>
                        </p>
                        <p>忘记密码</p>
                    </div>
                    <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>
                    <p class="go_login">没有账号
                        <span>立即注册</span>
                    </p>
                </div>
                <div class="inp" v-show="">
                    <input type="text" placeholder="手机号码" class="user">
                    <input type="text" class="pwd" placeholder="短信验证码">
                    <button id="get_code" class="btn btn-primary">获取验证码</button>
                    <button class="login_btn">登录</button>
                    <span class="go_login">没有账号
                    <span>立即注册</span>
                </span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: '',
                recall:true,
            }
        },
        methods: {
            //极验验证逻辑请求代码
            get_captcha() {
                this.$axios({
                    url: this.$settings.HOST + "user/captcha/",
                    method: 'get',
                    params: {
                        username: this.username,
                    }
                }).then(args => {
                    let data = JSON.parse(args.data);
                    // 使用initGeetest接口
                    // 参数1：配置参数
                    // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                    initGeetest({
                        gt: data.gt,
                        challenge: data.challenge,
                        product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        new_captcha: data.new_captcha
                    }, this.handlerPopup);

                }).catch(error => {
                    // console.log(error);
                    this.$message.error("用户名或密码错误");
                })
            },

            // 请求验证码的回调函数  完成验证码的验证
            handlerPopup(captchaObj) {
                // 回调函数中 this指向会被改变成 所以重新赋值
                let self = this;
                captchaObj.onSuccess(function () {
                    let validate = captchaObj.getValidate();
                    self.$axios({
                        url: self.$settings.HOST + "user/captcha/",
                        method: "post",
                        data: {
                            geetest_challenge: validate.geetest_challenge,
                            geetest_validate: validate.geetest_validate,
                            geetest_seccode: validate.geetest_seccode
                        }
                    }).then(args => {
                        console.log(args.data);
                        if (args.data.status) {
                            // 验证码验证成功 调用登录函数
                            self.login()
                        }
                    }).catch(error => {
                        this.$message.error('验证失败')
                    });
                });
                //  将生成的验证码添加到 id为geetest1的div中
                document.getElementById("geetest1").innerHTML = "";
                captchaObj.appendTo("#geetest1");
            },

            //登录
            login() {
                this.$axios({
                    url: this.$settings.HOST + 'user/login/',
                    method: 'post',
                    data: {
                        username: this.username,
                        password: this.password
                    }
                }).then(result => {
                    if (this.recall) {
                        localStorage.setItem('suser_token', result.data.token)
                        localStorage.username = result.data.username
                        localStorage.user_id = result.data.user_id;
                        sessionStorage.removeItem('suser_token')
                    } else {
                        sessionStorage.suser_token = result.data.token;
                        localStorage.removeItem('username')
                        localStorage.removeItem('user_id')
                        localStorage.removeItem('suser_token')
                    }
                    this.$message.success('恭喜你，登录成功')
                    this.$router.push('/')
                }).catch(error => {
                    this.$message.error('有户名或密码错误')
                })
            },

            //记住密码
            judge(){
                let user_name=localStorage.getItem('username')
                let js=JSON.stringify(user_name)
                console.log(js)
                if (this.recall){
                    // this.username=JSON.parse(user_name)
                    this.username=js
                }
            },
            created() {
            this.judge()
            },
        }
    }
</script>

<style scoped>
    .box {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .box img {
        width: 100%;
        min-height: 100%;
    }

    .box .login {
        position: absolute;
        width: 500px;
        height: 400px;
        top: 0;
        left: 0;
        margin: auto;
        right: 0;
        bottom: 0;
        top: -338px;
    }

    .login .login-title {
        width: 100%;
        text-align: center;
    }

    .login-title img {
        width: 190px;
        height: auto;
    }

    .login-title p {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #fff;
        letter-spacing: .29px;
        padding-top: 10px;
        padding-bottom: 50px;
    }

    .login_box {
        width: 400px;
        height: auto;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
        border-radius: 4px;
        margin: 0 auto;
        padding-bottom: 40px;
    }

    .login_box .title {
        font-size: 20px;
        color: #9b9b9b;
        letter-spacing: .32px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-around;
        padding: 50px 60px 0 60px;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .login_box .title span:nth-of-type(1) {
        color: #4a4a4a;
        border-bottom: 2px solid #84cc39;
    }

    .inp {
        width: 350px;
        margin: 0 auto;
    }

    .inp input {
        border: 0;
        outline: 0;
        width: 100%;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        text-indent: 20px;
        font-size: 14px;
        background: #fff !important;
    }

    .inp input.user {
        margin-bottom: 16px;
    }

    .inp .rember {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: 10px;
    }

    .inp .rember p:first-of-type {
        font-size: 12px;
        color: #4a4a4a;
        letter-spacing: .19px;
        margin-left: 22px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        /*position: relative;*/
    }

    .inp .rember p:nth-of-type(2) {
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: .19px;
        cursor: pointer;
    }

    .inp .rember input {
        outline: 0;
        width: 30px;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        text-indent: 20px;
        font-size: 14px;
        background: #fff !important;
    }

    .inp .rember p span {
        display: inline-block;
        font-size: 12px;
        width: 100px;
        /*position: absolute;*/
        /*left: 20px;*/

    }

    #geetest {
        margin-top: 20px;
    }

    .login_btn {
        width: 100%;
        height: 45px;
        background: #84cc39;
        border-radius: 5px;
        font-size: 16px;
        color: #fff;
        letter-spacing: .26px;
        margin-top: 30px;
    }

    .inp .go_login {
        text-align: center;
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: .26px;
        padding-top: 20px;
    }

    .inp .go_login span {
        color: #84cc39;
        cursor: pointer;
    }
</style>
