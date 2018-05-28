<template>
    <div class="footer-docs">
        <ul class="footer-docs-links">
          <li><a href="http://hub.slb.com/" target="_blank">Slb hub</a></li>
          <li><a href="https://slb1-swt.visualstudio.com/Support-Software_Metier_GIT/_home/" target="_blank">Teamspace</a></li>
          <li><a href="https://vuejs.org/" target="_blank">Third-party</a></li>
          <li><a href="https://en.wikipedia.org/wiki/Machine_learning" target="_blank">About</a></li>
        </ul>
        <div class="footer-docs-text">Maintained by the MLT team with the help of our contributors.</div>
        <div class="footer-docs-text">Code licensed SLB, docs CC BY 2.0.</div>
    </div>
</template>

<script>
export default {
    name: 'FooterDocs'
}
</script>

<style lang="scss" scoped>
.footer-docs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #2a2730;
  color: #99979c;
  padding: 5px 0;
}

.footer-docs-links {
  margin: 0 0 5px 0;
  padding: 0;
  li {
    display: inline-block;
    margin: 0 10px;
    a {
      color: white;
    }
    a:focus,
    a:hover {
      text-decoration: underline;
    }
  }
}

.footer-docs-text {
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .footer-docs-links {
    font-size: 0.8em;
  }
  .footer-docs-text {
    font-size: 0.6em;
  }
}
</style>
