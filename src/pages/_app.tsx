import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import Layout from '../components/layout';
import {ProvideAuth} from "../hooks/use-auth";
import AuthenticationChecker from "../components/authentication-checker";


function AwsCognitoAuthTrial({Component, pageProps}: AppProps) {
    return (
        <ProvideAuth>
            <Layout>
                <AuthenticationChecker>
                    <Component {...pageProps} />
                </AuthenticationChecker>
            </Layout>
        </ProvideAuth>
    );
}

export default AwsCognitoAuthTrial;
