workflow "Now Deploy" {
  on = "push"
  resolves = ["Deploy"]
}

action "Deploy" {
  uses = "actions/zeit-now@9fe84d557939d277e0d98318b625bd48d364a89b"
  secrets = ["GITHUB_TOKEN"]
}
