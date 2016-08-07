class Script < ActiveRecord::Base
	belongs_to :user, as: :owner_id
end
