<template>
    <div class="documents">
        <div class="content">
            <h1>{{ msg }}</h1>
            <h3>Essential Links</h3>
            <ul>
                <li v-for="l in links" :key="l.name">
                    <a :href="l.src" target="_blank">{{l.name}}</a>
                    <p>{{l.des}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Documents',

    data() {
        return {
            msg: 'Welcome to our Machine Learning world',
            links: [
                {
                    name: 'GitXiv',
                    src: 'http://gitxiv.com/',
                    des: 'GitHub meets Arxiv, or machine learning papers with code. Heavy focus on deep learning.'
                },
                {
                    name: 'YerevaNN',
                    src: 'http://yerevann.github.io/',
                    des: 'An Armenian blog on neural networks.'
                },
                {
                    name: 'Delip Rao',
                    src: 'http://deliprao.com',
                    des: 'Delip Rao recently started blogging, looks good so far.'
                },
                {
                    name: 'Jan Hendrik Metzen',
                    src: 'https://jmetzen.github.io',
                    des: 'Jan Hendrik Metzen has a blog on machine learning and python. We posit that you’re gonna like it.'
                },
                {
                    name: 'Christopher Olah',
                    src: 'http://colah.github.io/',
                    des: 'Christopher Olah has a couple of insightful posts about neural networks and convolutions.'
                },
                {
                    name: 'Triskelion’s blog',
                    src: 'http://mlwave.com/',
                    des: 'Triskelion’s blog, mostly about Kaggle competitions.'
                },
                {
                    name: 'Fresh posts, ',
                    src: 'https://raberrytv.wordpress.com/',
                    des: 'This site has a couple of fresh posts, recently about factorization machines.'
                },
                {
                    name: 'Daniel Lemire’s blog',
                    src: 'http://lemire.me/blog/',
                    des: 'Daniel Lemire’s blog on science and stuff.'
                },
                {
                    name: 'Machine Learning wiki',
                    src: 'https://en.wikipedia.org/wiki/Machine_learning',
                    des: 'Machine Learning Wikipedia.'
                }
            ]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.documents {
  margin: 20px auto;
  display: flex;
  justify-content: center;

  .content {
    width: 100%;
    padding: 0 20px;
    max-width: 1200px;
  }

  h1 {
    text-align: center;
  }

  ul {
    padding: 0;
  }

  li {
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  p {
    padding-top: 5px;
    margin-top: 0;
  }
}
</style>
