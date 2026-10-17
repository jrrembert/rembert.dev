<!-- Title: "Phase N (k/m): <what this layer does>" -->
Part of #N. <!-- On the top PR of the phase, write "Closes #N" instead. N is the issue number, the same as the phase number. -->
Stack: <!-- "Bottom of the phase N stack" / "Stacked on #PR" / "Single PR" -->

## What changed
<!-- One bullet per change. Name the file, make target or resource. Say why when it isn't obvious. -->
-

## Differs from the plan
<!-- Anything that changed from the phase spec or plan, and why. "None" is fine. -->

## Tested
<!-- The commands you ran and what you saw. Real output and numbers, not "works". -->
-

## Checklist
- [ ] Only used the lab's kubeconfig, `kind-consul` and `colima-consul`; `~/.kube/config`, the current Docker context and `local-k8s-poc` unchanged
- [ ] New versions pinned by tag or digest; no `latest`
- [ ] Setup targets (`make lab-up` etc.) still safe to re-run
- [ ] `AGENTS.md` updated if commands or conventions changed

### Top PR of the phase only
- [ ] Learning notes in `docs/learning/NN-<slug>.md`, including how it differs on EKS
- [ ] Rebuilt from scratch: `make lab-down`, then `make lab-up` and every later setup target
- [ ] "What I learned" comment added on the issue
