package com.vitalsenior.demo.integration;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** Garante que a aplicação sobe com o schema JPA no Postgres real. */
class DemoApplicationIT extends IntegrationTestBase {

    @Test
    void contextoDeveCarregarEConectarNoBanco() {
        assertThat(context).isNotNull();
        assertThat(usuarioRepo.count()).isZero();
    }
}
