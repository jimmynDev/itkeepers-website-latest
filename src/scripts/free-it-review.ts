/** Fail closed until an approved inquiry endpoint and delivery path exist. */
export function guardUnconfiguredReviewForms(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLFormElement>('form[data-free-it-review]').forEach((form) => {
    form.addEventListener('submit', (event) => event.preventDefault());
  });
}
