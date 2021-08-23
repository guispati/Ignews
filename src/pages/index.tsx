import {GetStaticProps} from 'next';

import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

import Image from 'next/image';
import avatar from '/public/images/avatar.svg';

interface HomeProps {
    product: {
        priceId:string;
        amount: string;
    }
}

export default function Home({product}: HomeProps ) {
    return (
        <>
            <Head>
                <title>Inicio | ig.news</title>
            </Head>
            <main className={styles.contentContainer}>
                <section className={styles.hero}>
                    <span>🤏 Ei, seja bem-vindo</span>
                    <h1>Novidades sobre <span>React</span> no mundo</h1>
                    <p>
                        Tenha acesso a todas as publicações <br />
                        <span>por apenas {product.amount} por mês</span>
                    </p>
                    <SubscribeButton />
                </section>

                <Image src={avatar} alt="Girl coding" />
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const price = await stripe.prices.retrieve('price_1JFS3AA79gZLOrNjCBLDrwLe', {
        expand: ['product']
    })

    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price.unit_amount / 100),
    };

    return {
        props: {
            product,
        },
        revalidate: 60 * 60 * 24 * 30, //1 mes
    }
}