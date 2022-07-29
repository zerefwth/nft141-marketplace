import styles from '@styles/Layout.module.css'

type Props = {
    nft_image: string
}

export default function Home({nft_image}: Props) {
    return (
        <div className={styles.grid}>
    <img src={nft_image} className={styles.card}></img>
        </div>
    );
}

export const getStaticProps = async () => {
    const res = await fetch('https://gateway.pinata.cloud/ipfs/QmS7vBvBqbdcUm3zx3cwkUc9hiFp4eqSW7xGoB5Wv6dzzj/THC_NAZA_001.json')
    const nft_metadata = await res.json()
    const nft_image = nft_metadata.image


    return {
        props: {
            nft_image
        }
    }
}
