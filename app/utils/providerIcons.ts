export const getProviderIcon = (providerName: string | undefined): string | null => {
    if (!providerName) return null;
    
    const name = providerName.toLowerCase().trim();
    switch (name) {
        case 'netflix':
            return 'https://image.tmdb.org/t/p/original/9A1JSVmSxsyaBK4SUFsYVqbAYfW.jpg';
        case 'disney plus':
        case 'disney+':
            return 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg';
        case 'hbo max':
        case 'hbo':
        case 'max':
            return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBX8kQEjtj-2RQNnyrVPgb4g7uDyyIJyDDQtzNSz9kx_HYcdnSVAo63P3uEbb2U1FB33UYX25PqfQhONYrhozXOORQ3EgFEkBOoLewRRSXdNzvlln45QDEeBzongeAYM2qw-FcqlMVAjgBjqz_XDobvyBz-6xlX2sQmihiFY7oLj3mgE0rkkWrIK4ZxwA/w1200-h675-p-k-no-nu/portada_max.png';
        case 'prime video':
        case 'amazon prime':
        case 'amazon prime video':
            return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/2560px-Amazon_Prime_Logo.svg.png';
        case 'hulu':
            return 'https://image.tmdb.org/t/p/original/gJ3yVMWouaVj6i1d6T1BQj1be1z.jpg';
        case 'apple tv+':
        case 'apple tv plus':
            return 'https://image.tmdb.org/t/p/original/6uhKBfmtzFqOcLousHwZuzcrScK.jpg';
        case 'peacock':
            return 'https://image.tmdb.org/t/p/original/8VCV78prwd9QzZnEm0ReO6bERDa.jpg';
        case 'paramount+':
        case 'paramount plus':
            return 'https://image.tmdb.org/t/p/original/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg';
        case 'mubi':
            return 'https://bb-media.com/wp-content/uploads/2024/06/JsBCte7adR00AAH2BuBA7uFMB2QfDgfprXMTiT4SPjA7Nk6GwpNjNSpZtGmdXfXKbww240-h480-rw.webp';
        case 'movistartv':
            return 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/9c/c7/b2/9cc7b283-81d9-ce08-44a2-4f18a47faeb0/AppIcon-MarcaUnificada-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg';
        default:
            return null;
    }
}; 