import Head from 'next/head'

export default function Home({articles}) {
  console.log(articles)
  return (
    <div>
      <Head>
        <title>WebDev News</title>
        <meta name="keywords" content="web develpment"/>
      </Head>
      Dash newssss

      {
        articles.map((item, index) => (
          <h3 key={index}>{item.title}</h3>
        ))
      }
    </div>
  )
}

export const getStaticProps = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
  const articles = await response.json()

  return {
    props: {
      articles
    }
  }
}
