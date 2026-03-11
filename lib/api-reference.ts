import { createOpenAPI } from 'fumadocs-openapi/server';
import { createAPIPage } from 'fumadocs-openapi/ui';

export const productApiReferences = {
  remitsense: {
    label: 'RemitSense',
    title: 'RemitSense API Reference',
    description: 'Browse RemitSense endpoints for transaction creation, lookup, and remittance workflows.',
    operations: [
      {
        slug: 'create-transaction',
        title: 'Create transaction',
        description: 'Create a new RemitSense transaction for downstream risk and operational workflows.',
        method: 'post',
        path: '/v1/remitsense/transactions',
      },
      {
        slug: 'get-transaction',
        title: 'Get transaction',
        description: 'Fetch a RemitSense transaction by identifier.',
        method: 'get',
        path: '/v1/remitsense/transactions/{transactionId}',
      },
    ],
  },
  insuresense: {
    label: 'InsureSense',
    title: 'InsureSense API Reference',
    description: 'Browse InsureSense endpoints for policy creation and policy retrieval workflows.',
    operations: [
      {
        slug: 'create-policy',
        title: 'Create policy',
        description: 'Create a new insurance policy through InsureSense.',
        method: 'post',
        path: '/v1/insuresense/policies',
      },
      {
        slug: 'get-policy',
        title: 'Get policy',
        description: 'Fetch a policy record and its current status.',
        method: 'get',
        path: '/v1/insuresense/policies/{policyId}',
      },
    ],
  },
  creditsense: {
    label: 'CreditSense',
    title: 'CreditSense API Reference',
    description: 'Browse CreditSense endpoints for loan application creation and application lookup.',
    operations: [
      {
        slug: 'create-loan-application',
        title: 'Create loan application',
        description: 'Submit a new credit application for scoring and loan processing.',
        method: 'post',
        path: '/v1/creditsense/loan-applications',
      },
      {
        slug: 'get-loan-application',
        title: 'Get loan application',
        description: 'Fetch the current state of a submitted loan application.',
        method: 'get',
        path: '/v1/creditsense/loan-applications/{applicationId}',
      },
    ],
  },
  meshsense: {
    label: 'MeshSense',
    title: 'MeshSense API Reference',
    description: 'Browse MeshSense endpoints for partner routing creation and route retrieval.',
    operations: [
      {
        slug: 'create-route',
        title: 'Create route',
        description: 'Create a new partner route for MeshSense orchestration.',
        method: 'post',
        path: '/v1/meshsense/routes',
      },
      {
        slug: 'get-route',
        title: 'Get route',
        description: 'Fetch a configured MeshSense route by identifier.',
        method: 'get',
        path: '/v1/meshsense/routes/{routeId}',
      },
    ],
  },
} as const;

export type ProductApiSlug = keyof typeof productApiReferences;

export const openapi = createOpenAPI({
  input: ['openapi/sasai-openapi.json'],
});

export const APIPage = createAPIPage(openapi);

export function isProductApiSlug(value: string): value is ProductApiSlug {
  return value in productApiReferences;
}

export function getProductApiReference(product: string) {
  if (!isProductApiSlug(product)) {
    return null;
  }

  return productApiReferences[product];
}

export function getProductApiOperation(product: string, operation: string) {
  const reference = getProductApiReference(product);

  if (!reference) {
    return null;
  }

  return reference.operations.find((item) => item.slug === operation) ?? null;
}

