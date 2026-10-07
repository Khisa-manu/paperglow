<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $orgId = session('active_organization_id');
        if ($orgId) {
            $builder->where($model->getTable() . '.organization_id', $orgId);
        }
    }
}
