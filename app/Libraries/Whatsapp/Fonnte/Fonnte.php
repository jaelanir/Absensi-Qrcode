<?php

namespace App\Libraries\Whatsapp\Fonnte;

use App\Libraries\Whatsapp\Whatsapp;

class Fonnte implements Whatsapp
{
    private string $urlApi = 'https://api.fonnte.com/send';

    public function __construct(public ?string $token) {}

    public function getProvider(): string
    {
        return 'Fonnte';
    }

    public function getToken(): string
    {
        return $this->token ?? env('WHATSAPP_TOKEN');
    }

    /**
     * Send message to Fonnte API
     * @param array|string $messages
     * @return string
     */
    public function sendMessage(array|string $messages): string
    {
        $messages = isset($messages[0]) ? $messages : [$messages];
        $fonnteMessage = new FonnteBulkMessage($messages);
        $curl = curl_init();
        $jsonMessage = $fonnteMessage->toJson();

        // Enable verbose output for debugging
        curl_setopt($curl, CURLOPT_VERBOSE, true);
        curl_setopt_array($curl, array(
            CURLOPT_URL => $this->urlApi,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => array('data' => $jsonMessage),
            CURLOPT_HTTPHEADER => array(
                "Authorization: {$this->getToken()}"
            ),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ));

        $response = curl_exec($curl);

        try {
            // Cek error curl sebelum menutup
            if (curl_errno($curl)) {
                $errorMsg = curl_error($curl);
                $curlErrorCode = curl_errno($curl);
                curl_close($curl);
                log_message('error', 'Fonnte API cURL error [' . $curlErrorCode . ']: ' . $errorMsg);
                return 'Error: ' . $errorMsg;
            }

            // Tutup curl setelah tidak ada error
            curl_close($curl);

            // Validasi response
            if (empty($response)) {
                log_message('error', 'Fonnte API empty response');
                return 'Error: Empty response from API';
            }

            $responseStatus = json_decode($response, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                log_message('error', 'Fonnte API invalid JSON response: ' . $response);
                return 'Error: Invalid response from API';
            }

            $resultMessage = $responseStatus['reason'] ?? 'Unknown error';

            if (isset($responseStatus['status']) && $responseStatus['status']) {
                $resultMessage = $responseStatus['detail'] ?? 'Success';
            }

            return $resultMessage;
        } catch (\Exception $e) {
            // Tutup curl jika ada exception
            if (isset($curl) && is_resource($curl)) {
                curl_close($curl);
            }
            log_message('error', 'Fonnte API exception: ' . $e->getMessage());
            return 'Error: ' . $e->getMessage();
        }
    }
}
