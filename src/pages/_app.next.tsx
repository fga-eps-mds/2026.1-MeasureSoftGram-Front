import '@styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React, { ReactElement, useEffect, useState } from 'react';
import Theme from '@components/Theme';
import { ProductProvider } from '@contexts/ProductProvider';
import { RepositoryProvider } from '@contexts/RepositoryProvider';
import { OrganizationProvider } from '@contexts/OrganizationProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@contexts/Auth';
import { useRouter } from 'next/router';
import { RotatingLines } from 'react-loader-spinner';
import { Modal, Box } from '@mui/material';
import { appWithI18Next, useSyncLanguage } from 'ni18n';
import { useTranslation } from 'react-i18next';
import { SnackbarProvider } from '@components/snackbar';
import { ni18nConfig } from "../../n18n.config";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, disableBreadcrumb?: boolean) => typeof page;
  disableBreadcrumb?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Modo mock (issue #64): quando NEXT_PUBLIC_API_MOCKING === 'enabled', o worker
// MSW precisa subir antes de qualquer render para interceptar as chamadas do
// axios. Fora do modo mock o valor inicial ja e true e nada acontece.
const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [mockingReady, setMockingReady] = useState(!isMockingEnabled);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const disableBreadcrumb = Component.disableBreadcrumb ?? false;

  const locale: any =
    typeof window !== 'undefined' && window.localStorage.getItem('locale_lang')

  useSyncLanguage(locale);

  // Sobe o worker MSW (client-only) e semeia a sessao fake antes de renderizar.
  useEffect(() => {
    if (!isMockingEnabled) return;
    import('../mocks/initMocks')
      .then(({ initMocks }) => initMocks())
      .catch((error) => console.error('Falha ao iniciar o modo mock:', error))
      .finally(() => setMockingReady(true));
  }, []);

  const router = useRouter();
  const transformValue = 'translate(-50%, -50%)';

  useEffect(() => {
    let timeoutId;

    const handleRouteChange = () => {
      console.log(`App is changing to`);
      setModalOpen(false);

      // Set timeout for 2 seconds before showing the loading animation
      timeoutId = setTimeout(() => {
        setLoading(true);
        setModalOpen(true);
      }, 2000);
    };

    const handleRouteComplete = () => {
      console.log('you have finished going to the new page');
      clearTimeout(timeoutId);

      setLoading(false);
      setModalOpen(false);
      setShowError(false);
    };

    const nextNavigationHandler = (url) => {
      if (errorOccurred) {
        router.events.emit('routeChangeError')
        // eslint-disable-next-line no-throw-literal
        throw "Abort route change by user's confirmation."
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('beforeHistoryChange', nextNavigationHandler);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
      clearTimeout(timeoutId);
    };
  }, [errorOccurred]);

  // Ensure the modal doesn't open if the loading is faster than the delay
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        setModalOpen(true);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [loading]);

  useEffect(() => {
    const errorTimeoutId = setTimeout(() => {
      if (loading) {
        // Show error modal only if still loading after 10 seconds
        setShowError(true);
        setErrorOccurred(true);
        setModalOpen(false);
        setLoading(false);
      }
    }, 20000);

    return () => clearTimeout(errorTimeoutId);
  }, [loading]);

  const closeModal = () => {
    setShowError(false);
    setErrorOccurred(false);
  }

  const { t } = useTranslation();

  // No modo mock, espera o worker MSW estar pronto antes de montar os providers,
  // garantindo que o AuthContext leia a sessao fake ja semeada.
  if (!mockingReady) return null;

  return (
    <SnackbarProvider>
      <AuthProvider>
        <OrganizationProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <RepositoryProvider>
            <ProductProvider>
              <Theme>
                {getLayout(<Component {...pageProps} />, disableBreadcrumb)}
                <>
                  <Modal
                    open={modalOpen}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: transformValue,
                        width: '100vw',
                        height: '100vh',
                      }}
                    >
                      <div
                        style={{
                          position: 'fixed',
                          top: '50%',
                          left: '50%',
                          transform: transformValue,
                        }}
                      >
                        <RotatingLines
                          strokeColor="#33568E"
                          strokeWidth="5"
                          width="50"
                          animationDuration="0.75"
                          timeout={3000}
                        />
                        <h3
                          style={{
                            position: 'absolute',
                            top: '75%',
                            left: '50%',
                            transform: transformValue,
                            fontSize: '24px',
                            color: '#000000',
                            textShadow: `
                            -1px -1px 0 #33568E,
                            1px -1px 0 #33568E,
                            -1px  1px 0 #33568E,
                            1px  1px 0 #33568E
                          `,
                          }}
                        >
                          {t('loading')}
                        </h3>
                      </div>
                    </Box>
                  </Modal>

                  <Modal
                    open={showError}
                    onClose={closeModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: transformValue,
                        backgroundColor: 'white',
                        outline: '0',
                        width: '30%',
                        height: '20%',
                      }}
                    >
                      <div
                        style={{
                          position: 'fixed',
                          top: '50%',
                          left: '50%',
                          transform: transformValue,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '20px',
                            color: '#FF0000',
                          }}
                        >
                          <div>{t('timeout')}</div>
                          <div>{t('try-again')}</div>
                        </h3>
                        <h3
                          style={{
                            fontSize: '10px',
                            color: '#000000',
                            top: '50%',
                            marginTop: '1px',
                          }}
                        >
                          <div>({t('close')})</div>
                        </h3>
                      </div>
                    </Box>
                  </Modal>
                </>
              </Theme>
            </ProductProvider>
          </RepositoryProvider>
        </OrganizationProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default appWithI18Next(MyApp, ni18nConfig);
